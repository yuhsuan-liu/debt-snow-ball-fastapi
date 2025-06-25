#!/bin/bash
export PYTHONPATH=$PYTHONPATH:/Users/yuhsuanliu/Desktop/SWE2025/projects_2025/snowball_fastapi
cd backend
uvicorn main:app --reload
