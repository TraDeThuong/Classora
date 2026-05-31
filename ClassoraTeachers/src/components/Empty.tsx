interface EmptyProps {
  resourceName: string;
}

export default function Empty({ resourceName }: EmptyProps) {
  return <p>No {resourceName} could be found.</p>;
}