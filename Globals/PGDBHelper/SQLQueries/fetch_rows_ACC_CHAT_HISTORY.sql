SELECT "ID",
       "USER_ID",
       "CREATED_AT",
       "CHAT"
FROM postgres."ACC_CHAT_HISTORY"
WHERE "CREATED_AT" >= CURRENT_DATE + INTERVAL '$$gt$$ DAY'
 AND "CREATED_AT" < CURRENT_DATE + INTERVAL '$$lt$$ DAY'
  AND "USER_ID" like '$$user_id$$'
