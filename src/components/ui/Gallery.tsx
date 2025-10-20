import { useEffect, useState } from 'react';
import FormattedAscii from './FormattedAscii';
import { Skeleton } from './skeleton';

export default function Gallery() {
  const [data, setData] = useState<any>([]);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const doFetch = async () => {
      await fetch('/gallery.json')
        .then(res => res.json())
        .then(json => setData(json));
    }
    doFetch()
  }, []);

  useEffect(() => {
    if (!data.length) return;
    setVisibleCount(0);

    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= data.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 5); // ms between each render

    return () => clearInterval(interval);
  }, [data]);

  const visibleData = [...data].reverse().slice(0, visibleCount);

  return (
    <div className="flex flex-wrap gap-5 justify-center mt-10">
      {visibleData.map((ascii, index) => (
        <div key={index} className="flex w-min outline rounded-4xl overflow-hidden justify-center items-center relative">
            <pre className="text-[3px] whitespace-pre text-center">
              <FormattedAscii style={ascii["style"]}>{ascii["ascii"]}</FormattedAscii>
            </pre>
        </div>
      ))}
      {visibleCount < data.length && <Skeleton className="h-[765px] w-[618.062px] rounded-4xl" />}
    </div>
  );
}
