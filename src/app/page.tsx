'use client'
import Banner from "@/components/ui/Banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { generateImage, getAsciiFromUpload } from "./actions";
import { useState } from "react";
import { toast } from "sonner";
import FormattedAscii from "@/components/ui/FormattedAscii";
import { Loader2 } from "lucide-react";
import {FlowerSet1, FlowerSet2} from "@/components/ui/Flowers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Gallery from "@/components/ui/Gallery";
import GalleryButton from "@/components/ui/GalleryButton";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";

type ColoredChar = {
  char: string;
  color: string;
};

type AsciiAndType = {
  ascii: string | ColoredChar[][];
  style: string;
  path: string;
}

export default function Home() {
  
  const [asciiList, setASCIIList] = useState<AsciiAndType[]>([])
  const [prompt, setPrompt] = useState("")
  const [fileBytes, setFileBytes] = useState<number[]>()
  const [inputType, setInputType] = useState("prompt")
  const [style, setStyle] = useState<string>("color")
  const [size, setSize] = useState<string>("normal")
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const byteArray = Array.from(uint8Array);
    setFileBytes(byteArray)
    console.log(fileBytes)
  }

  function generate() {
    if (inputType == "prompt" && !prompt) {
      toast.error("You must enter a prompt")
      return
    }

    if (inputType == "upload" && !fileBytes) {
      toast.error("You must upload a file")
      return
    }
    
    const fetchGeneration = async () => {
      setLoading(true)
      if (inputType == "prompt") {
        const res = await generateImage(prompt, style)
        if (!res) {
          toast.error("Failed to generate image")
        } else {
          setASCIIList([...asciiList, res])
        }
      } else if (inputType == "upload") {

        if (!fileBytes) {
          toast.error("You need to upload a file to do that!")
          return
        }
        const res = await getAsciiFromUpload(fileBytes, style)
        if (!res) {
          toast.error("Failed to generate image")
        } else {
          setASCIIList([...asciiList, res])
        }
      } else {
        toast.error("Invalid Input Type!")
      }
      setLoading(false)
    }
    fetchGeneration()
  }

  return (
    <div className="">
      <div className="w-full flex items-center justify-between h-80 bg-pink-100 text-sm gap-4">
        <FlowerSet1 />
        <Banner />
        <FlowerSet2 />
      </div>
      <div className="flex justify-center pt-10 pb-10">
        <div className="w-[90%]">
          <Tabs defaultValue="generate">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="generate">
              <div className="flex justify-center mb-10">
                <div className="w-100">
                  <div className="flex justify-center gap-5 my-5 items-center text-xs">
                    Prompt
                    <Switch onCheckedChange={(checked) => checked ? setInputType("upload") : setInputType("prompt")} />
                    Upload
                  </div>
                  { inputType == "prompt" &&
                    <Input className="flex-4" placeholder="ASCII Image Prompt..." value={prompt} onChange={(e) => setPrompt(e.target.value || "")}/>
                  }
                  { inputType == "upload" &&
                    <Input className="flex-3" type="file" accept="image/*" onChange={((e) => handleFileChange(e))} />
                  }
                  <div className="flex items-center justify-between pt-2">
                    <Label className="mr-2" htmlFor="size">Size:</Label>
                    <select id="size" name="size" value={size} onChange={(e) => setSize(e.target.value)}
                      className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
                      <option value="large">Large</option>
                      <option value="normal">Normal</option>
                      <option value="small">Small</option>
                    </select>
                    <Label className="ml-10 mr-2" htmlFor="style">Style:</Label>
                    <select id="style" name="style" value={style} onChange={(e) => setStyle(e.target.value)}
                      className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
                      <option value="bw">Black & White</option>
                      <option value="color">Colored</option>
                      <option value="rgb">RGB</option>
                    </select>
                  </div>
                  <div className="flex justify-center pt-2">
                    <Button className="w-full" type="button" variant="outline" disabled={loading} onClick={() => generate()}>
                      {loading ? (
                        <Loader2 size={20} className="animate-spin mx-auto" />
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-5 justify-center">
                {[...asciiList].reverse().map((ascii, index) => (
                  <div key={index}>
                    <div className="flex w-min outline rounded-4xl overflow-hidden justify-center items-center relative">
                      <pre className="text-[3px] whitespace-pre text-center">
                        <FormattedAscii style={ascii["style"]}>{ascii["ascii"]}</FormattedAscii>
                      </pre>
                    </div>
                    <div className="flex justify-center">
                      <GalleryButton ascii={ascii["ascii"]} style={ascii["style"]} path={ascii["path"]} />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="gallery">
              <Gallery />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}