import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onFileProcessed?: (data: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Felaktigt filformat",
        description: "Vänligen ladda upp en Excel-fil (.xlsx, .xls) eller CSV-fil.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Filen är för stor",
        description: "Filstorleken får inte överstiga 10MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const processFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setIsProcessing(true);
    setProgress(0);
    setFileName(file.name);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // TODO: Transform data from laget.se format to digitala lagkassan format
      // This is where the actual data transformation logic would go
      const transformedData = transformData(jsonData);

      // Create new workbook with transformed data
      const newWorkbook = XLSX.utils.book_new();
      const newWorksheet = XLSX.utils.json_to_sheet(transformedData);
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Lagkassan Import');

      // Generate file blob
      const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProcessedFile(blob);
      
      toast({
        title: "Filen har konverterats!",
        description: "Din fil är redo att laddas ner för import i Digitala Lagkassan.",
      });

      onFileProcessed?.(transformedData);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Fel vid bearbetning",
        description: "Ett fel uppstod när filen bearbetades. Kontrollera att filen är korrekt formaterad.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onFileProcessed, toast]);

  // Transform laget.se format to Digitala Lagkassan format
  const transformData = (data: any[]): any[] => {
    const result: any[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Check if this row is a player (Aktiv)
      if (row.Roll === 'Aktiv') {
        const playerData: any = {
          'Aktiv': row.Namn || '',
          'Vårdnadshavare1': '',
          'E-post1': '',
          'Mobilnummer1': '',
          'Vårdnadshavare2': '',
          'E-post2': '',
          'Mobilnummer2': ''
        };
        
        // Look for guardians following this player
        let guardianCount = 0;
        let j = i + 1;
        
        // Continue until we find the next player or reach end of data
        while (j < data.length && data[j].Roll !== 'Aktiv' && guardianCount < 2) {
          const guardianRow = data[j];
          
          // Only process parents/guardians (skip coaches/leaders)
          if (guardianRow.Roll === 'Förälder') {
            guardianCount++;
            
            if (guardianCount === 1) {
              playerData['Vårdnadshavare1'] = guardianRow.Namn || '';
              playerData['E-post1'] = guardianRow['E-post (primär)'] || '';
              playerData['Mobilnummer1'] = guardianRow.Mobiltelefon || '';
            } else if (guardianCount === 2) {
              playerData['Vårdnadshavare2'] = guardianRow.Namn || '';
              playerData['E-post2'] = guardianRow['E-post (primär)'] || '';
              playerData['Mobilnummer2'] = guardianRow.Mobiltelefon || '';
            }
          }
          j++;
        }
        
        result.push(playerData);
      }
    }
    
    return result;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const downloadFile = () => {
    if (!processedFile) return;

    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lagkassan_import_${fileName.replace(/\.[^/.]+$/, '')}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetUpload = () => {
    setProcessedFile(null);
    setProgress(0);
    setFileName('');
  };

  if (processedFile) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-medium">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Konvertering klar!
            </h3>
            <p className="text-muted-foreground">
              Din fil har konverterats och är redo för import i Digitala Lagkassan.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={downloadFile}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-soft"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Ladda ner konverterad fil
            </Button>
            
            <Button 
              onClick={resetUpload}
              variant="outline"
              size="lg"
            >
              Konvertera en ny fil
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medium">
      <CardContent className="p-8">
        {isProcessing ? (
          <div className="text-center space-y-4">
            <FileSpreadsheet className="w-16 h-16 mx-auto text-primary animate-pulse" />
            <h3 className="text-xl font-semibold text-foreground">
              Bearbetar din fil...
            </h3>
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Konverterar från laget.se format till Digitala Lagkassan
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            }`} />
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Ladda upp din Excel-fil från laget.se
            </h3>
            
            <p className="text-muted-foreground mb-6">
              Dra och släpp din fil här, eller klicka för att välja fil
            </p>
            
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            
            <label htmlFor="file-upload">
              <Button 
                asChild
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-soft cursor-pointer"
              >
                <span>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Välj fil
                </span>
              </Button>
            </label>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground text-left">
                  <p className="font-medium mb-1">Filformat som stöds:</p>
                  <ul className="space-y-1">
                    <li>• Excel-filer (.xlsx, .xls)</li>
                    <li>• CSV-filer (.csv)</li>
                    <li>• Maximal filstorlek: 10MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;