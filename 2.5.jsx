// Course.jsx
import React from 'react';

const Header = ({ name }) => <h2>{name}</h2>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <div>
    {parts.map((p) => (
      <Part key={p.id} part={p} />
    ))}
  </div>
);

const Total = ({ parts }) => {
  const total = parts.reduce((sum, p) => sum + p.exercises, 0);
  return (
    <p>
      <strong>Total of {total} exercises</strong>
    </p>
  );
};

const Course = ({ course }) => {
  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
