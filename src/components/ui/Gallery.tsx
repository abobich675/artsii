import { useEffect, useState } from 'react';
import FormattedAscii from './FormattedAscii';

export default function Gallery() {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    fetch('/gallery.json')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  return (
    <div className="flex flex-wrap gap-5 justify-center">
        {[...data].reverse().map((ascii, index) => (
          <div key={index} className="flex w-min outline rounded-4xl overflow-hidden justify-center items-center relative">
              <pre className="text-[3px] whitespace-pre text-center">
                  <FormattedAscii style={ascii["style"]}>{ascii["ascii"]}</FormattedAscii>
              </pre>
          </div>
        ))}
    </div>
  );
}
