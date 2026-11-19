-- EngNet - Banco de Dados de Gestão de Presença Acadêmica
-- SGBD: PostgreSQL
-- Autor: EngNet - Engenharia de Redes
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- Tipos ----------
DROP VIEW IF EXISTS vw_dashboard CASCADE;
DROP VIEW IF EXISTS vw_faltosos CASCADE;
DROP VIEW IF EXISTS vw_frequencia_aluno CASCADE;
DROP VIEW IF EXISTS vw_historico_turma CASCADE;

DROP TABLE IF EXISTS presencas CASCADE;
DROP TABLE IF EXISTS aulas CASCADE;
DROP TABLE IF EXISTS matriculas CASCADE;
DROP TABLE IF EXISTS alunos CASCADE;
DROP TABLE IF EXISTS turmas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

DROP TYPE IF EXISTS perfil_usuario CASCADE;
DROP TYPE IF EXISTS status_matricula CASCADE;
DROP TYPE IF EXISTS status_presenca CASCADE;

CREATE TYPE perfil_usuario AS ENUM ('admin', 'professor');
CREATE TYPE status_matricula AS ENUM ('ativa', 'trancada', 'cancelada');
CREATE TYPE status_presenca AS ENUM ('presente', 'falta', 'justificada');

-- ---------- Usuários do sistema ----------
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    perfil perfil_usuario NOT NULL DEFAULT 'professor',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- Alunos ----------
CREATE TABLE alunos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula VARCHAR(30) NOT NULL UNIQUE,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE,
    telefone VARCHAR(25),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- Turmas ----------
CREATE TABLE turmas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(120) NOT NULL,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    descricao TEXT,
    professor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    dias_semana VARCHAR(20)[] NOT NULL DEFAULT '{}',
    carga_horaria NUMERIC(7,2) NOT NULL DEFAULT 0,
    semestre SMALLINT,
    ano SMALLINT,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_turma_horario CHECK (horario_fim > horario_inicio),
    CONSTRAINT ck_turma_carga CHECK (carga_horaria >= 0),
    CONSTRAINT ck_turma_semestre CHECK (semestre IS NULL OR semestre IN (1, 2)),
    CONSTRAINT ck_turma_dias CHECK (
        dias_semana <@ ARRAY['segunda','terca','quarta','quinta','sexta','sabado','domingo']::VARCHAR(20)[]
    )
);

-- ---------- Matrículas (relação aluno x turma) ----------
CREATE TABLE matriculas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    data_matricula DATE NOT NULL DEFAULT CURRENT_DATE,
    status status_matricula NOT NULL DEFAULT 'ativa',
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_matricula_turma_aluno UNIQUE (turma_id, aluno_id)
);

-- ---------- Aulas ----------
CREATE TABLE aulas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    professor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    data_hora_inicio TIMESTAMPTZ NOT NULL,
    data_hora_fim TIMESTAMPTZ NOT NULL,
    conteudo TEXT,
    observacoes TEXT,
    criada_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_aula_horario CHECK (data_hora_fim > data_hora_inicio)
);

-- ---------- Presenças ----------
CREATE TABLE presencas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aula_id UUID NOT NULL REFERENCES aulas(id) ON DELETE CASCADE,
    aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    status status_presenca NOT NULL DEFAULT 'falta',
    registrado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    registrado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    observacao TEXT,
    CONSTRAINT uq_presenca_aula_aluno UNIQUE (aula_id, aluno_id)
);

-- ---------- Atualização automática de atualizado_em ----------
CREATE OR REPLACE FUNCTION atualizar_data_modificacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_atualizado
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION atualizar_data_modificacao();

CREATE TRIGGER trg_alunos_atualizado
BEFORE UPDATE ON alunos
FOR EACH ROW EXECUTE FUNCTION atualizar_data_modificacao();

CREATE TRIGGER trg_turmas_atualizado
BEFORE UPDATE ON turmas
FOR EACH ROW EXECUTE FUNCTION atualizar_data_modificacao();

-- ---------- Regra: só pode registrar frequência de aluno matriculado ----------
CREATE OR REPLACE FUNCTION validar_aluno_matriculado()
RETURNS TRIGGER AS $$
DECLARE
    v_turma_id UUID;
    v_status status_matricula;
BEGIN
    SELECT a.turma_id
      INTO v_turma_id
      FROM aulas a
     WHERE a.id = NEW.aula_id;

    IF v_turma_id IS NULL THEN
        RAISE EXCEPTION 'Aula não encontrada.';
    END IF;

    SELECT m.status
      INTO v_status
      FROM matriculas m
     WHERE m.turma_id = v_turma_id
       AND m.aluno_id = NEW.aluno_id;

    IF v_status IS NULL OR v_status <> 'ativa' THEN
        RAISE EXCEPTION 'O aluno não possui matrícula ativa nesta turma.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_aluno_matriculado
BEFORE INSERT OR UPDATE OF aula_id, aluno_id ON presencas
FOR EACH ROW EXECUTE FUNCTION validar_aluno_matriculado();

-- ---------- Índices para consultas frequentes ----------
CREATE INDEX idx_alunos_nome ON alunos(nome);
CREATE INDEX idx_turmas_professor ON turmas(professor_id);
CREATE INDEX idx_matriculas_aluno ON matriculas(aluno_id);
CREATE INDEX idx_matriculas_turma_status ON matriculas(turma_id, status);
CREATE INDEX idx_aulas_turma_data ON aulas(turma_id, data_hora_inicio);
CREATE INDEX idx_presencas_aluno ON presencas(aluno_id);
CREATE INDEX idx_presencas_aula_status ON presencas(aula_id, status);

-- ---------- View: frequência individual ----------
-- Aulas anteriores à data de matrícula não entram no cálculo.
-- 'presente' e 'justificada' contam como frequência.
CREATE OR REPLACE VIEW vw_frequencia_aluno AS
SELECT
    al.id AS aluno_id,
    al.matricula,
    al.nome AS aluno,
    t.id AS turma_id,
    t.nome AS turma,
    COUNT(a.id) AS total_aulas,
    COUNT(p.id) FILTER (
        WHERE p.status IN ('presente', 'justificada')
    ) AS aulas_com_frequencia,
    COUNT(a.id) - COUNT(p.id) FILTER (
        WHERE p.status IN ('presente', 'justificada')
    ) AS faltas,
    CASE
        WHEN COUNT(a.id) = 0 THEN 0
        ELSE ROUND(
            100.0 * COUNT(p.id) FILTER (
                WHERE p.status IN ('presente', 'justificada')
            ) / COUNT(a.id), 2
        )
    END AS percentual_presenca
FROM matriculas m
JOIN alunos al ON al.id = m.aluno_id
JOIN turmas t ON t.id = m.turma_id
LEFT JOIN aulas a
       ON a.turma_id = t.id
      AND a.data_hora_inicio::DATE >= m.data_matricula
LEFT JOIN presencas p
       ON p.aula_id = a.id
      AND p.aluno_id = al.id
WHERE m.status = 'ativa'
GROUP BY al.id, al.matricula, al.nome, t.id, t.nome;

-- ---------- View: alunos com frequência abaixo de 75% ----------
CREATE OR REPLACE VIEW vw_faltosos AS
SELECT *
FROM vw_frequencia_aluno
WHERE total_aulas > 0
  AND percentual_presenca < 75;

-- ---------- View: histórico de aulas e presenças por turma ----------
CREATE OR REPLACE VIEW vw_historico_turma AS
SELECT
    t.id AS turma_id,
    t.nome AS turma,
    t.codigo,
    a.id AS aula_id,
    a.data_hora_inicio,
    a.data_hora_fim,
    a.conteudo,
    al.id AS aluno_id,
    al.nome AS aluno,
    al.matricula,
    p.status AS status_presenca,
    p.registrado_em,
    u.nome AS registrado_por
FROM turmas t
JOIN aulas a ON a.turma_id = t.id
JOIN matriculas m
  ON m.turma_id = t.id
 AND m.status = 'ativa'
 AND a.data_hora_inicio::DATE >= m.data_matricula
JOIN alunos al ON al.id = m.aluno_id
LEFT JOIN presencas p
  ON p.aula_id = a.id
 AND p.aluno_id = al.id
LEFT JOIN usuarios u ON u.id = p.registrado_por;

-- ---------- View: indicadores do dashboard ----------
CREATE OR REPLACE VIEW vw_dashboard AS
SELECT
    (SELECT COUNT(*) FROM alunos WHERE ativo = TRUE) AS total_alunos,
    (SELECT COUNT(*) FROM aulas) AS total_aulas,
    COALESCE(
        (SELECT ROUND(AVG(percentual_presenca), 2)
           FROM vw_frequencia_aluno
          WHERE total_aulas > 0),
        0
    ) AS taxa_media_presenca,
    (SELECT COUNT(*) FROM vw_faltosos) AS total_alertas_baixa_frequencia,
    (SELECT COUNT(*) FROM turmas WHERE ativa = TRUE) AS total_turmas;

-- ============================================================
-- DADOS DE EXEMPLO
-- A senha abaixo é apenas um placeholder. Substitua por um hash
-- bcrypt gerado no back-end antes de testar o login.
-- ============================================================

INSERT INTO usuarios (nome, email, senha_hash, perfil)
VALUES
('Professor Demonstração', 'professor@engnet.com',
 '$2b$10$SUBSTITUIR_PELO_HASH_BCRYPT_REAL', 'professor'),
('Administrador Demonstração', 'admin@engnet.com',
 '$2b$10$SUBSTITUIR_PELO_HASH_BCRYPT_REAL', 'admin');

INSERT INTO alunos (matricula, nome, email, telefone)
VALUES
('2026001', 'Ana Souza', 'ana@aluno.com', '(61) 99999-0001'),
('2026002', 'Bruno Lima', 'bruno@aluno.com', '(61) 99999-0002'),
('2026003', 'Carla Dias', 'carla@aluno.com', '(61) 99999-0003');

INSERT INTO turmas (
    nome, codigo, descricao, professor_id,
    horario_inicio, horario_fim, dias_semana,
    carga_horaria, semestre, ano
)
VALUES (
    'Laboratório de Redes', 'LAB-101',
    'Aulas práticas de laboratório de redes de comunicação.',
    (SELECT id FROM usuarios WHERE email = 'professor@engnet.com'),
    '08:00', '10:00', ARRAY['segunda','quarta']::VARCHAR(20)[],
    60, 2, 2026
);

INSERT INTO matriculas (turma_id, aluno_id, data_matricula)
SELECT t.id, al.id, DATE '2026-11-01'
FROM turmas t
CROSS JOIN alunos al
WHERE t.codigo = 'LAB-101';

INSERT INTO aulas (
    turma_id, professor_id, data_hora_inicio, data_hora_fim, conteudo
)
SELECT
    t.id,
    u.id,
    TIMESTAMPTZ '2026-11-02 08:00:00-03',
    TIMESTAMPTZ '2026-11-02 10:00:00-03',
    'Introdução aos equipamentos de rede'
FROM turmas t
CROSS JOIN usuarios u
WHERE t.codigo = 'LAB-101'
  AND u.email = 'professor@engnet.com';

INSERT INTO aulas (
    turma_id, professor_id, data_hora_inicio, data_hora_fim, conteudo
)
SELECT
    t.id,
    u.id,
    TIMESTAMPTZ '2026-11-04 08:00:00-03',
    TIMESTAMPTZ '2026-11-04 10:00:00-03',
    'Configuração de switches'
FROM turmas t
CROSS JOIN usuarios u
WHERE t.codigo = 'LAB-101'
  AND u.email = 'professor@engnet.com';

-- Aula 1: Ana presente, Bruno faltou, Carla presente.
INSERT INTO presencas (aula_id, aluno_id, status, registrado_por)
SELECT a.id, al.id,
       CASE al.matricula
           WHEN '2026001' THEN 'presente'::status_presenca
           WHEN '2026002' THEN 'falta'::status_presenca
           ELSE 'presente'::status_presenca
       END,
       u.id
FROM aulas a
CROSS JOIN alunos al
CROSS JOIN usuarios u
WHERE a.conteudo = 'Introdução aos equipamentos de rede'
  AND u.email = 'professor@engnet.com';

-- Aula 2: Ana presente, Bruno faltou, Carla presente.
INSERT INTO presencas (aula_id, aluno_id, status, registrado_por)
SELECT a.id, al.id,
       CASE al.matricula
           WHEN '2026001' THEN 'presente'::status_presenca
           WHEN '2026002' THEN 'falta'::status_presenca
           ELSE 'presente'::status_presenca
       END,
       u.id
FROM aulas a
CROSS JOIN alunos al
CROSS JOIN usuarios u
WHERE a.conteudo = 'Configuração de switches'
  AND u.email = 'professor@engnet.com';

-- ---------- Consultas rápidas para validar a instalação ----------
-- SELECT * FROM vw_dashboard;
-- SELECT * FROM vw_frequencia_aluno ORDER BY aluno;
-- SELECT * FROM vw_faltosos;
-- SELECT * FROM vw_historico_turma ORDER BY data_hora_inicio, aluno;