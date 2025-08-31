import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart, Minus, Plus } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  category: string;
  sku: string;
}

interface AddSaleModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (productId: number, quantity: number) => void;
}

export const AddSaleModal = ({ product, open, onClose, onConfirm }: AddSaleModalProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = () => {
    if (product && quantity > 0 && quantity <= product.stock) {
      onConfirm(product.id, quantity);
      setQuantity(1);
      onClose();
    }
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (!product) return null;

  const totalPrice = (product.price * quantity).toFixed(2);
  const isValidQuantity = quantity > 0 && quantity <= product.stock;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Add Sale
          </DialogTitle>
          <DialogDescription>
            Record a sale for {product.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Product Info */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{product.name}</span>
              <span className="text-primary font-semibold">${product.price}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>SKU: {product.sku}</span>
              <span>Available: {product.stock} units</span>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustQuantity(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  if (val >= 1 && val <= product.stock) {
                    setQuantity(val);
                  }
                }}
                className="text-center"
                min={1}
                max={product.stock}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustQuantity(1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {!isValidQuantity && (
              <p className="text-sm text-destructive">
                Please enter a valid quantity (1-{product.stock})
              </p>
            )}
          </div>

          {/* Total */}
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Sale Amount:</span>
              <span className="text-2xl font-bold text-primary">${totalPrice}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValidQuantity}
            className="bg-gradient-to-r from-primary to-primary-hover"
          >
            Confirm Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};