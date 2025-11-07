import { useEffect, useState } from 'react';
import FormattedAscii from './FormattedAscii';
import { Skeleton } from './skeleton';
import { getDatabaseAscii, getGalleryContents } from '@/app/actions';

export default function Gallery() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const doFetch = async () => {
      const galleryContents = await getGalleryContents()
      if (!galleryContents) return false

      const asciiResults = [];
      for (const e of galleryContents) {
        const asciiData = await getDatabaseAscii(e.image, e.style);
        asciiResults.push({ ...e, ...asciiData });
        setData(asciiResults);
        await new Promise(r => setTimeout(r, 50));
      }


      setLoading(false)
    }
    doFetch()
  }, []);

  // const visibleData = [...data].reverse().slice(0, visibleCount);
  // const visibleData = [...data].reverse();

  return (
    <div className="flex flex-wrap gap-5 justify-center mt-10">
      {data.map((ascii, index) => (
        <div key={index} className="flex w-min outline rounded-4xl overflow-hidden justify-center items-center relative">
            <pre className="text-[3px] whitespace-pre text-center">
              <FormattedAscii style={ascii["style"]}>{ascii["ascii"]}</FormattedAscii>
            </pre>
        </div>
      ))}
      {/* {visibleCount < data.length && <Skeleton className="h-[765px] w-[618.062px] rounded-4xl" />} */}
      {loading && <Skeleton className="h-[765px] w-[618.062px] rounded-4xl" />}
    </div>
  );
}
