import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertCircle, 
  Mic, 
  MicOff, 
  Send, 
  Clock, 
  Activity, 
  AlertTriangle, 
  Search, 
  Info 
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Condition {
  name: string;
  probability: number;
  description: string;
  symptoms: string[];
  recommendation: string;
}

interface DiagnosisResult {
  possibleConditions: Condition[];
  riskFactors: {
    age: string;
    region: string;
    medicalHistory: string;
  };
  urgency: "low" | "medium" | "high";
  nextSteps: string[];
}

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "AI Symptom Checker | ArogyaAI+";
  }, []);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: "Voice recording stopped",
        description: "Your symptoms have been captured.",
      });
    } else {
      setIsListening(true);
      toast({
        title: "Listening for symptoms",
        description: "Please describe your symptoms clearly.",
      });
      
      setTimeout(() => {
        setIsListening(false);
        setSymptoms(prevSymptoms => prevSymptoms + 
          (prevSymptoms ? " " : "") + 
          "I've been having a persistent dry cough for the past 3 days with mild fever and fatigue."
        );
        toast({
          title: "Voice recording completed",
          description: "Your symptoms have been captured.",
        });
      }, 3000);
    }
  };

  const analyzeSymptomsWithAI = () => {
    if (!symptoms.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please describe your symptoms first.",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const mockResult: DiagnosisResult = {
        possibleConditions: [
          {
            name: "Common Cold",
            probability: 75,
            description: "A viral infection of the upper respiratory tract that typically resolves within 7-10 days.",
            symptoms: ["Cough", "Mild fever", "Fatigue", "Sore throat", "Runny nose"],
            recommendation: "Rest, stay hydrated, and take over-the-counter cold medicine if needed."
          },
          {
            name: "COVID-19",
            probability: 45,
            description: "A respiratory illness caused by the SARS-CoV-2 virus with varying severity.",
            symptoms: ["Cough", "Fever", "Fatigue", "Shortness of breath", "Loss of taste/smell"],
            recommendation: "Consider getting tested and isolate until results are received."
          },
          {
            name: "Seasonal Flu",
            probability: 30,
            description: "A contagious respiratory illness caused by influenza viruses.",
            symptoms: ["Fever", "Cough", "Fatigue", "Body aches", "Sore throat"],
            recommendation: "Rest, stay hydrated, and consult a doctor if symptoms worsen."
          }
        ],
        riskFactors: {
          age: "Medium risk based on typical adult profile",
          region: "Elevated risk due to current flu season in your area",
          medicalHistory: "Insufficient data provided"
        },
        urgency: "medium",
        nextSteps: [
          "Monitor your symptoms for the next 24-48 hours",
          "Stay hydrated and get plenty of rest",
          "Take over-the-counter fever reducers if needed",
          "If symptoms worsen or persist beyond 5 days, consult with a healthcare professional",
          "Consider scheduling a teleconsultation for further evaluation"
        ]
      };
      
      setDiagnosisResult(mockResult);
      setIsLoading(false);
      
      toast({
        title: "Analysis Complete",
        description: "Your symptoms have been analyzed by our AI.",
      });
    }, 3000);
  };

  return (
    <div className="container py-8 px-4 md:px-6 max-w-6xl">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">AI Symptom Checker</h1>
        <p className="text-muted-foreground">
          Describe your symptoms in detail, and our AI will analyze them to provide a preliminary assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Describe Your Symptoms</CardTitle>
            <CardDescription>
              Include when they started, their severity, and any other relevant information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Example: I've been experiencing a persistent headache for the past 2 days, along with fatigue and mild fever..."
                className="min-h-[150px]"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              <div className="flex items-center text-sm text-muted-foreground">
                <Info size={16} className="mr-2" />
                <span>For accurate results, please be as detailed as possible about your symptoms.</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between">
            <Button 
              variant="outline" 
              onClick={toggleListening}
              className={isListening ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50" : ""}
              disabled={isLoading}
            >
              {isListening ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" /> Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" /> Record Symptoms
                </>
              )}
            </Button>
            <Button 
              onClick={analyzeSymptomsWithAI} 
              disabled={isLoading || !symptoms.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Analyze Symptoms
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Our AI uses advanced NLP to analyze your symptoms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-health-blue-light text-health-blue rounded-full p-2 mt-1">
                <Search size={16} />
              </div>
              <div>
                <h4 className="font-medium">Symptom Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI processes your symptoms using natural language understanding.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-health-green-light text-health-green rounded-full p-2 mt-1">
                <Activity size={16} />
              </div>
              <div>
                <h4 className="font-medium">Pattern Matching</h4>
                <p className="text-sm text-muted-foreground">
                  Compares your symptoms against thousands of medical conditions.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-health-orange-light text-health-orange rounded-full p-2 mt-1">
                <AlertCircle size={16} />
              </div>
              <div>
                <h4 className="font-medium">Risk Assessment</h4>
                <p className="text-sm text-muted-foreground">
                  Evaluates urgency based on symptoms, age, and regional factors.
                </p>
              </div>
            </div>
            <div className="border-t border-border pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                <AlertTriangle size={14} className="inline mr-1" />
                This is not a replacement for professional medical advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {diagnosisResult && (
        <div className="mt-8 animate-in">
          <Card className="shadow-md">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI Diagnosis Results</CardTitle>
                  <CardDescription>
                    Based on the symptoms you described
                  </CardDescription>
                </div>
                <Badge 
                  className={
                    diagnosisResult.urgency === "high" 
                      ? "bg-health-red text-white" 
                      : diagnosisResult.urgency === "medium" 
                        ? "bg-health-orange text-white" 
                        : "bg-health-green text-white"
                  }
                >
                  {diagnosisResult.urgency === "high" 
                    ? "High Urgency" 
                    : diagnosisResult.urgency === "medium" 
                      ? "Medium Urgency" 
                      : "Low Urgency"
                  }
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="conditions">
                <TabsList className="mb-4">
                  <TabsTrigger value="conditions">Possible Conditions</TabsTrigger>
                  <TabsTrigger value="risk">Risk Factors</TabsTrigger>
                  <TabsTrigger value="steps">Recommended Steps</TabsTrigger>
                </TabsList>
                <TabsContent value="conditions">
                  <div className="space-y-6">
                    {diagnosisResult.possibleConditions.map((condition, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium">{condition.name}</h3>
                          <div className="text-sm font-medium">
                            Match: {condition.probability}%
                          </div>
                        </div>
                        <Progress 
                          value={condition.probability} 
                          className={cn(
                            "h-2 mb-4",
                            condition.probability > 70 
                              ? "bg-secondary [&>div]:bg-health-red" 
                              : condition.probability > 40 
                                ? "bg-secondary [&>div]:bg-health-orange" 
                                : "bg-secondary [&>div]:bg-health-green"
                          )}
                        />
                        <p className="text-sm text-muted-foreground mb-3">
                          {condition.description}
                        </p>
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-2">Common Symptoms:</h4>
                          <div className="flex flex-wrap gap-1">
                            {condition.symptoms.map((symptom, i) => (
                              <Badge key={i} variant="outline" className="bg-secondary/50">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Recommendation:</h4>
                          <p className="text-sm text-muted-foreground">
                            {condition.recommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="risk">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Age Factor</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {diagnosisResult.riskFactors.age}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Regional Factor</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {diagnosisResult.riskFactors.region}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Medical History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {diagnosisResult.riskFactors.medicalHistory}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Info size={18} />
                        <h3 className="font-medium">Understanding Risk Factors</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Risk factors help our AI contextualize your symptoms based on your profile and location.
                        For more accurate assessments, consider completing your health profile with age,
                        medical history, and current location.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="steps">
                  <div className="space-y-4">
                    <div className="bg-secondary/30 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-2">
                        <Clock size={18} className="mt-0.5" />
                        <div>
                          <h3 className="font-medium">Recommended Next Steps</h3>
                          <p className="text-sm text-muted-foreground">
                            Based on our AI analysis, here's what you should consider doing next
                          </p>
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {diagnosisResult.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Button className="w-full sm:w-auto">
                        Schedule Teleconsultation
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="bg-secondary/30 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <p>This AI assessment is for informational purposes only and does not constitute medical advice. Always consult with a healthcare professional for proper diagnosis and treatment.</p>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => setDiagnosisResult(null)}>
              Clear results and start over
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-10 mb-6">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How accurate is the AI symptom checker?</AccordionTrigger>
            <AccordionContent>
              Our AI symptom checker has been trained on extensive medical data and achieves approximately 85-90% accuracy in providing preliminary assessments. However, it's designed to be a supportive tool, not a replacement for professional medical diagnosis. Always consult with healthcare professionals for definitive diagnoses and treatment plans.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is my health data secure and private?</AccordionTrigger>
            <AccordionContent>
              Yes, ArogyaAI+ takes data security and privacy very seriously. All your health data is encrypted using HIPAA-compliant standards. We never share your personal information with third parties without your explicit consent. You can review our comprehensive privacy policy for more details.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What languages are supported for the symptom checker?</AccordionTrigger>
            <AccordionContent>
              Currently, our symptom checker supports English, Hindi, Marathi, Tamil, Telugu, and Bengali. We're continuously working to add support for more regional languages to make healthcare more accessible to everyone across the country.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>What should I do after receiving my AI assessment?</AccordionTrigger>
            <AccordionContent>
              After receiving your AI assessment, review the recommended next steps carefully. For conditions with medium to high urgency ratings, consider scheduling a teleconsultation with a healthcare professional through our platform. For low urgency conditions, follow the self-care recommendations and monitor your symptoms. If symptoms persist or worsen, consult with a healthcare provider.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SymptomChecker;
