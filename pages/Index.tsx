// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Loader, BookOpen } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';
// import DropZone from '@/components/DropZone';
// import Output from '@/components/Output';
// import { Link } from 'react-router-dom';

// const Index = () => {
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [result, setResult] = useState<string | null>(null);
//   const { toast } = useToast();

//   const handleImageDrop = (file: File) => {
//     setSelectedImage(file);
//     setResult(null);
//     toast({
//       title: "Image uploaded",
//       description: file.name,
//     });
//   };

//   const handleProcess = async () => {
//     if (!selectedImage) {
//       toast({
//         title: "No image selected",
//         description: "Please drop an image first",
//         variant: "destructive",
//       });
//       return;
//     }
  
//     setIsProcessing(true);
//     console.log("[DEBUG] handleProcess start, file =", selectedImage);
  
//     try {
//       const formData = new FormData();
//       formData.append("file", selectedImage);
  
//       console.log("[DEBUG] about to fetch /predict…");
//       const res = await fetch("/predict", {
//         method: "POST",
//         body: formData,
//       });
//       console.log("[DEBUG] fetch returned", res);
  
//       const raw = await res.text();
//       console.log("[DEBUG] raw response text:", raw);
  
//       let data: { letter: string; confidence: number };
//       try {
//         data = JSON.parse(raw);
//       } catch (jsonErr) {
//         throw new Error(`Failed to parse JSON: ${jsonErr} — raw: ${raw}`);
//       }
  
//       if (!res.ok) {
//         throw new Error(`Status ${res.status}: ${raw}`);
//       }
  
//       const { letter } = data; // Removed confidence from destructuring
//       console.log("[DEBUG] parsed JSON:", data);
  
//       setResult(letter); // Removed confidence percentage display
//     } catch (err: any) {
//       console.error("[ERROR] Prediction failed:", err);
//       toast({
//         title: "Prediction failed",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//       console.log("[DEBUG] handleProcess done");
//     }
//   };  

//   return (
//     <div className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto fade-in">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl md:text-4xl font-bold">Shadow Monarch's ASL Vision</h1> {/* Changed title */}
//         <Link to="/readme">
//           <Button variant="outline" className="gap-2">
//             <BookOpen className="w-4 h-4" />
//             README
//           </Button>
//         </Link>
//       </div>

//       <div className="space-y-8">
//         <DropZone onImageDrop={handleImageDrop} />

//         {selectedImage && (
//           <div className="flex justify-center">
//             <Button
//               onClick={handleProcess}
//               disabled={isProcessing}
//               className="w-full md:w-auto"
//             >
//               {isProcessing ? (
//                 <>
//                   <Loader className="mr-2 h-4 w-4 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 'Process Image'
//               )}
//             </Button>
//           </div>
//         )}

//         <Output result={result} />
//       </div>
//     </div>
//   );
// };

// export default Index;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DropZone from '@/components/DropZone';
import Output from '@/components/Output';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle drag-and-drop or file selection
  const handleFilesDrop = (files: File[]) => {
    setSelectedFiles(files);
    setResult(null);
    toast({
      title: `${files.length} file(s) loaded`,
      description: files.map(f => f.name).join(', '),
    });
  };

  // Process all files and concatenate predictions
  const handleProcess = async () => {
    if (!selectedFiles.length) {
      toast({
        title: 'No images selected',
        description: 'Please drag & drop images or select a folder',
        variant: 'destructive',
      });
      return;
    }
    setIsProcessing(true);
    try {
      const outputs: string[] = [];
      for (let file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/predict', { method: 'POST', body: formData });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json(); // { letter }
        outputs.push(json.letter);
      }
      const sequence = outputs.join('');
      setResult(sequence);
      toast({ title: 'Completed', description: sequence });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-black text-white">
      {/* Anime-Style Aura Effects */}
            {/* Left Aura Glow */}
            <motion.div
              className="pointer-events-none absolute top-0 bottom-0 left-0 w-60 bg-gradient-to-r from-blue-300/90 to-transparent blur-[160px]"
              initial={{ opacity: 0.4, scale: 1 }}
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
      
            {/* Right Aura Glow */}
            <motion.div
              className="pointer-events-none absolute top-0 bottom-0 right-0 w-60 bg-gradient-to-l from-blue-300/90 to-transparent blur-[160px]"
              initial={{ opacity: 0.4, scale: 1 }}
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* Main Interface */}
      <div className="relative z-10 p-4 md:p-8 max-w-3xl mx-auto fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold">Shadow Monarch's ASL Vision</h1>
          <Link to="/readme">
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" /> README
            </Button>
          </Link>
        </div>

        {/* Drag & Drop Area */}
        <DropZone multiple onDrop={handleFilesDrop} />

        {selectedFiles.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="text-sm text-white truncate">
                  {file.name}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Button onClick={handleProcess} disabled={isProcessing} className="w-full md:w-auto">
                {isProcessing ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Processing...</> : 'Process Images'}
              </Button>
            </div>
          </>
        )}

        {/* Output */}
        {result !== null && <Output result={result} />}
      </div>
    </div>
  );
};

export default Index;
