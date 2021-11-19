use employees;

INSERT INTO department
    (name)
VALUES
    ('Engineering'),
    ('Manufacturing'),
    ('Research & Development'),
    ('Marketing')
    ('Sales'),;

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Engineer Manager', 130000, 1),
    ('Lead Engineer', 80000, 1),
    ('Junior Engineer', 90000, 1),
    ('Manufacturing Manager', 120000, 2),
    ('Manufacturer', 90000, 2),
    ('Lead Developer', 125000, 3),
    ('Researcher', 90000, 3),
    ('Marketing Manager', 190000, 4),
    ('Marketing Associate', 90000, 4),
    ('Sales Manager', 190000, 5),
    ('Sales Associate', 90000, 4) ;

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Eric', 'Dole', 1, NULL),
    ('Lindsey', 'Channing', 2, NULL),
    ('Ashley', 'Rodriguez', 3, 1),
    ('Ronda', 'Tool', 4, 2),
    ('Kelly', 'Singer', 5, 4),
    ('Malia', 'Browning', 6, 4),
    ('Sara', 'Lord', 7, 4),
    ('Tomas', 'Anderson', 8, 4)
    ('Kerry', 'Lord', 9, 4),
    ('Erica', 'Rodriguez', 10, 4),
    ('Cindy', 'Browning', 11, 2),
    ('Peter', 'Rodriguez', 12, 2),
    ('Porter', 'Channing', 14, NULL),
    ('Tiffany', 'Dole', 1, NULL);
