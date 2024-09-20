import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await apiService.get('/projects/');
        setProjects(fetchedProjects);
        setLoading(false);
      } catch (err) {
        setError('Error fetching projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="project-list">
      <h2>My Projects</h2>
      {projects.length === 0 ? (
        <p>No projects found. The backend is healthy but there's no data yet.</p>
      ) : (
        projects.map(project => (
          <div key={project.id} className="project-item">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>Technologies: {project.technologies}</p>
            {project.project_url && <a href={project.project_url} target="_blank" rel="noopener noreferrer">View Project</a>}
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectList;