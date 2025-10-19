import { useEffect, useState } from 'react';
import FormattedAscii from './FormattedAscii';
import { Loader2 } from 'lucide-react';

export default function Gallery() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const doFetch = async () => {
      setLoading(true)
      await fetch('/gallery.json')
        .then(res => res.json())
        .then(json => setData(json));
      setLoading(false)
    }
    doFetch()
  }, []);

  if (loading) {
    return <Loader2 size={100} className="animate-spin mx-auto mt-10" />
  }

  return (
    <div className="flex flex-wrap gap-5 justify-center mt-10">
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
