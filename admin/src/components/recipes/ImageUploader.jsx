// src/components/recipes/ImageUploader.jsx
import { Form } from 'react-bootstrap';

export default function ImageUploader({ images, setImages }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  return (
    <Form.Group controlId="images" className="mb-3">
      <Form.Label>Recipe Images</Form.Label>
      <Form.Control type="file" multiple onChange={handleFileChange} />
      <div className="mt-2">
        {images.length > 0 && images.map((img, idx) => (
          <div key={idx}>{img.name}</div>
        ))}
      </div>
    </Form.Group>
  );
}
