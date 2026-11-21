-- Seed migration: Create initial admin user (hash será preenchido via script)
-- Este é um placeholder, rodado manualmente após setup do Supabase

-- INSERT INTO users (email, name, role, password_hash)
-- VALUES (
--   'admin@institute.com',
--   'Admin Master',
--   'master',
--   'bcrypt-hash-aqui'
-- );

-- Função para auditoria automática (opcional)
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (
    user_id,
    entity_type,
    entity_id,
    action,
    old_values,
    new_values,
    created_at
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    to_jsonb(OLD),
    to_jsonb(NEW),
    now()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger automático (opcional, comentado por padrão)
-- CREATE TRIGGER campanha_audit AFTER INSERT OR UPDATE OR DELETE ON campanhas
--   FOR EACH ROW EXECUTE FUNCTION audit_trigger();
-- CREATE TRIGGER receita_audit AFTER INSERT OR UPDATE OR DELETE ON receitas
--   FOR EACH ROW EXECUTE FUNCTION audit_trigger();
-- CREATE TRIGGER despesa_audit AFTER INSERT OR UPDATE OR DELETE ON despesas
--   FOR EACH ROW EXECUTE FUNCTION audit_trigger();
-- CREATE TRIGGER doacao_audit AFTER INSERT OR UPDATE OR DELETE ON doacoes_materiais
--   FOR EACH ROW EXECUTE FUNCTION audit_trigger();
