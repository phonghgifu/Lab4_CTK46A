#!/bin/bash

# Script tạo 5 bài viết test cho pagination

curl -X POST "https://bwsuuckbekvfgahwawvl.supabase.co/rest/v1/posts" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3c3V1Y2tiZWt2Zmdhahdhd3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI1OTQzNzcsImV4cCI6MjAyODE3MDM3N30.RxJuHJNkN5p9N7wRGzfEqNUvHm0QbVTaXj8mOLh3fqc" \
  -H "Content-Type: application/json" \
  -d '
  [
    {"title": "Bài 1", "slug": "bai-1", "content": "Nội dung bài 1", "excerpt": "Tóm tắt 1", "status": "published", "author_id": "9642f57-fb6e-46a6-baf0-0dba3847b767", "published_at": "2025-04-19T10:00:00Z"},
    {"title": "Bài 2", "slug": "bai-2", "content": "Nội dung bài 2", "excerpt": "Tóm tắt 2", "status": "published", "author_id": "9642f57-fb6e-46a6-baf0-0dba3847b767", "published_at": "2025-04-19T11:00:00Z"},
    {"title": "Bài 3", "slug": "bai-3", "content": "Nội dung bài 3", "excerpt": "Tóm tắt 3", "status": "published", "author_id": "9642f57-fb6e-46a6-baf0-0dba3847b767", "published_at": "2025-04-19T12:00:00Z"},
    {"title": "Bài 4", "slug": "bai-4", "content": "Nội dung bài 4", "excerpt": "Tóm tắt 4", "status": "published", "author_id": "9642f57-fb6e-46a6-baf0-0dba3847b767", "published_at": "2025-04-19T13:00:00Z"},
    {"title": "Bài 5", "slug": "bai-5", "content": "Nội dung bài 5", "excerpt": "Tóm tắt 5", "status": "published", "author_id": "9642f57-fb6e-46a6-baf0-0dba3847b767", "published_at": "2025-04-19T14:00:00Z"}
  ]
  '
