-- Query all users
SELECT * FROM users;

-- Query all debts
SELECT * FROM debts;

-- Query debts for specific user
SELECT d.* 
FROM debts d
WHERE d.username = 'test_1';

-- Query payment plans
SELECT * FROM payment_plans;

-- Join query to see users and their debts
SELECT u.username, d.name as debt_name, d.amount, d.interest_rate
FROM users u
LEFT JOIN debts d ON u.username = d.username
ORDER BY u.username, d.amount DESC;
