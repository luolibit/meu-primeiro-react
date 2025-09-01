from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Movie(Base):
    __tablename__ = "movies"
    movie_id = Column(Integer, primary_key=True, nullable=False)
    searchTerm = Column(String(1024), nullable=False)
    count = Column(Integer, default=1)
    poster_url = Column(String(2024), nullable=False)