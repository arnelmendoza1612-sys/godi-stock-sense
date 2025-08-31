import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  ShoppingCart, 
  Package, 
  Search, 
  BarChart3, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";

interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: "Welcome to GODI",
    icon: <Package className="h-8 w-8 text-primary" />,
    content: "GODI is your modern inventory tracking solution. Let's walk through the key features to get you started managing your inventory efficiently.",
    highlight: "Getting Started"
  },
  {
    title: "Dashboard Overview",
    icon: <Package className="h-8 w-8 text-primary" />,
    content: "The main dashboard displays all your products in easy-to-read cards. Each card shows the product name, price, current stock level, and category. Products with low stock are highlighted in red.",
    highlight: "Product Cards"
  },
  {
    title: "Search & Filter",
    icon: <Search className="h-8 w-8 text-primary" />,
    content: "Use the search bar to find products by name or SKU. The category filter helps you narrow down products by type. This makes managing large inventories much easier.",
    highlight: "Find Products Fast"
  },
  {
    title: "Add Sales",
    icon: <ShoppingCart className="h-8 w-8 text-primary" />,
    content: "Click the 'Add Sale' button on any product card to record a sale. You can specify the quantity, and the system will automatically reduce your stock levels and show the total sale amount.",
    highlight: "Record Sales"
  },
  {
    title: "Restock Items",
    icon: <Package className="h-8 w-8 text-success" />,
    content: "Use the 'Restock' button to add inventory to any product. The system provides quick options to fill to your low stock threshold or double the threshold for better planning.",
    highlight: "Manage Inventory"
  },
  {
    title: "Low Stock Alerts",
    icon: <AlertTriangle className="h-8 w-8 text-destructive" />,
    content: "When products fall below their set threshold, you'll see red alerts at the top of the page. The system also sends notifications when you make sales that trigger low stock warnings.",
    highlight: "Stay Informed"
  },
  {
    title: "Analytics & Reports",
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    content: "Click the Analytics button to view sales trends, stock levels, and performance metrics. This helps you make informed decisions about purchasing and inventory management.",
    highlight: "Track Performance"
  },
  {
    title: "You're Ready!",
    icon: <CheckCircle className="h-8 w-8 text-success" />,
    content: "You now know how to use all the key features of GODI. Start by exploring your product catalog, record some sales, and keep an eye on those stock levels. Happy managing!",
    highlight: "Start Managing"
  }
];

export const TutorialModal = ({ open, onClose }: TutorialModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            GODI Tutorial
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              Step {currentStep + 1} of {tutorialSteps.length}
            </Badge>
            <div className="flex space-x-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tutorial Step Content */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {currentTutorialStep.icon}
            </div>
            
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary">
                {currentTutorialStep.highlight}
              </Badge>
              <h3 className="text-xl font-semibold mb-3">
                {currentTutorialStep.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {currentTutorialStep.content}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              <Button variant="ghost" onClick={handleClose}>
                Skip Tutorial
              </Button>
              
              {currentStep < tutorialSteps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleClose} className="bg-gradient-to-r from-success to-success/90">
                  Get Started
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};