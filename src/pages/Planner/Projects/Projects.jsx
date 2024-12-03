import "./Projects.css";
import { useProjectStore } from "../../../store";
import Container from "../Container/Container";

const Projects = () => {
  const projectState = useProjectStore((state) => state);
  const { filteredProjects, setInstance, setDialog } = projectState;

  return (
    <>
      <Container
        title="projects"
        containers={filteredProjects}
        setInstance={setInstance}
        setDialog={setDialog}
      />
    </>
  );
};

export default Projects;
