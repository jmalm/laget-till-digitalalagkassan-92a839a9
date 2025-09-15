import React from 'react';
import { FileSpreadsheet, ArrowRight, Shield, Zap } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-soft border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Lagkassan Converter
              </h1>
              <p className="text-sm text-muted-foreground">
                Konvertera filer från laget.se till Digitala Lagkassan
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Enkel filkonvertering för svenska lag
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Konvertera spelarlistan från laget.se till ett format som kan importeras 
            direkt i Digitala Lagkassan. Snabbt, säkert och enkelt.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="mb-16">
          <FileUpload />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-soft border-border">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">Snabb konvertering</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Konvertera din fil på några sekunder. Ingen väntan, inga krångel.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Säker hantering</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Alla filer bearbetas lokalt i din webbläsare. Ingen data skickas till externa servrar.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">Enkel process</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Ladda upp, konvertera och ladda ner. Tre enkla steg till en perfekt importfil.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="shadow-medium border-border">
          <CardHeader>
            <CardTitle className="text-xl">Så här använder du verktyget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Från laget.se:</h4>
                <ol className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Logga in på laget.se</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Gå till medlemmar/spelare</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Exportera till Excel-format</span>
                  </li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3">Till Digitala Lagkassan:</h4>
                <ol className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Ladda upp filen här</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Vänta på konvertering</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Ladda ner och importera i Lagkassan</span>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Lagkassan Converter - Ett verktyg för svenska idrottsföreningar
            </p>
            <p className="text-xs mt-2">
              Alla filer bearbetas lokalt i din webbläsare för maximal säkerhet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;