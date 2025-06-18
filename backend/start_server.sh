#!/bin/bash
export PYTHONPATH=/Users/yuhsuanliu/Desktop/SWE2025/projects_2025/snowball_fastapi:$PYTHONPATH
cd /Users/yuhsuanliu/Desktop/SWE2025/projects_2025/snowball_fastapi
uvicorn backend.main:app --reload
