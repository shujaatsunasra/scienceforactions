-- Apply the trigger function for action completion count
CREATE OR REPLACE FUNCTION bump_action_completion_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment when newly marked completed
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'completed' THEN
      UPDATE action_items
        SET completion_count = completion_count + 1,
            updated_at = NOW()
      WHERE id = NEW.action_id;
    ELSIF OLD.status = 'completed' AND NEW.status <> 'completed' THEN
      UPDATE action_items
        SET completion_count = GREATEST(completion_count - 1, 0),
            updated_at = NOW()
      WHERE id = NEW.action_id;
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    IF NEW.status = 'completed' THEN
      UPDATE action_items
        SET completion_count = completion_count + 1,
            updated_at = NOW()
      WHERE id = NEW.action_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_actions_completion ON user_actions;
CREATE TRIGGER trg_user_actions_completion
  AFTER INSERT OR UPDATE ON user_actions
  FOR EACH ROW
  EXECUTE FUNCTION bump_action_completion_count();
