#!/bin/bash
export PYTHONPATH=/Users/yuhsuanliu/Desktop/SWE2025/projects_2025/snowball_fastapi:$PYTHONPATH
uvicorn backend.main:app --reload
