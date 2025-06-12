from backend.database import engine
from backend.models import debt, user

# Create all tables
def init_db():
    debt.Base.metadata.create_all(bind=engine)
    user.Base.metadata.create_all(bind=engine)
