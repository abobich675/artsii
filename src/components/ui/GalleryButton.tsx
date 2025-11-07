import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addToDatabase, addToGallery } from '@/app/actions';

type ColoredChar = {
  char: string;
  color: string;
};

type GalleryButtonProps = {
  ascii: string | ColoredChar[][]
  style: string;
  path: string;
};

const GalleryButton = ({ ascii, style, path}: GalleryButtonProps) => {
  const [loading, setLoading] = useState(false)

  function addImage() {
    
    const fetchGeneration = async () => {
      setLoading(true)

      // const res = await addToGallery(ascii, style)
      const res = await addToDatabase(path, style, "", "", "", true)

      if (!res) {
        toast.error("Failed to add image to gallery")
      }
      setLoading(false)
    }
    fetchGeneration()
  }

  return (
    <Button className="w-50 mt-2" type="button" variant="outline" disabled={loading} onClick={() => addImage()}>
      {loading ? (
        <Loader2 size={20} className="animate-spin mx-auto" />
      ) : (
        "Add To Gallery"
      )}</Button>
  );
}
export default GalleryButton