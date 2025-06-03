// src/components/ManageProducts.js
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/FirebaseService";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "@firebase/firestore";
import { 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  FormGroup, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormControl, 
  InputLabel, 
  Select, 
  Slide,
  MenuItem 
} from "@mui/material";
import "./ManageProducts.css";
import { Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useLocation, useNavigate } from "react-router-dom"; // ✅ Fix here


const imgbbAPIKey = "23116f943c41b078861c20e46f8b67d8";


const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // <-- new
  const [newProduct, setNewProduct] = useState({
    name: "",
    fabric: "",
    color: "",
    sleeve: "",
    pattern: "",
    originalPrice: "",
    discount: "",
    price: "",
    imageUrl: "",
    sizes: [],
    category: "",
    id: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (location.state?.productToEdit) {
      setNewProduct(location.state.productToEdit);
      setImagePreview(location.state.productToEdit.imageUrl);
      setIsEditing(true);
    }
  }, [location.state]);
  


  //navigate(location.pathname, { replace: true, state: {} });
  const fetchProducts = async () => {
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(firestore, "products"));
    const productsArray = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(productsArray);
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(firestore, "categories"));
    const categoriesArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setCategories(categoriesArray);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      await addDoc(collection(firestore, "categories"), { name: newCategory });
      setNewCategory("");
      setOpenDialog(false);
      fetchCategories();
    }
  };


  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const { originalPrice, discount } = newProduct;
    if (originalPrice && discount) {
      const discountAmount = (originalPrice * discount) / 100;
      const discountedPrice = originalPrice - discountAmount;
      setNewProduct((prev) => ({
        ...prev,
        price: discountedPrice.toFixed(2),
      }));
    } else {
      setNewProduct((prev) => ({ ...prev, price: "" }));
    }
  }, [newProduct.originalPrice, newProduct.discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSizeChange = (size) => {
    setNewProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImagesUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImagesToImgBB = async (files) => {
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        urls.push(data.data.url);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
    return urls;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = (await uploadImagesToImgBB([imageFile]))[0];
      }

      await addDoc(collection(firestore, "products"), {
        ...newProduct,
        imageUrl,
        timestamp: serverTimestamp(),
      });

      setNewProduct({
        name: "",
        fabric: "",
        color: "",
        sleeve: "",
        pattern: "",
        originalPrice: "",
        discount: "",
        price: "",
        imageUrl: "",
        sizes: [],
        category: "",
        timestamp: serverTimestamp(),
      });
      setImageFile(null);
      setImagePreview("");
      setAlertMessage("Product Added successfully!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000); // auto-hide after 3s
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct(product);
    setImagePreview(product.imageUrl);
    setIsEditing(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      let updatedImageUrl = newProduct.imageUrl;

      if (imageFile) {
        updatedImageUrl = (await uploadImagesToImgBB([imageFile]))[0];
      }

      const productRef = doc(firestore, "products", newProduct.id);
      await updateDoc(productRef, {
        ...newProduct,
        imageUrl: updatedImageUrl,
        updatedAt: serverTimestamp(),
      });

      setIsEditing(false);
      setNewProduct({
        name: "",
        fabric: "",
        sleeve: "",
        pattern: "",
        color: "",
        originalPrice: "",
        discount: "",
        price: "",
        imageUrl: "",
        sizes: [],
        category: "",
        updatedAt: serverTimestamp(),
      });
      setImageFile(null);
      setImagePreview("");
      setAlertMessage("Product updated successfully!");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(firestore, "products", id));
      setProducts(products.filter((product) => product.id !== id));
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="product-management-container">
      {showSuccessAlert && (
  <Slide direction="down" in={showSuccessAlert} mountOnEnter unmountOnExit>
    <Alert
      icon={<CheckIcon fontSize="inherit" />}
      severity="success"
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        boxShadow: 3,
        width: 'auto',
        minWidth: '250px'
      }}
    >
      {alertMessage}
    </Alert>
  </Slide>
)}
      <h2>Manage Products</h2>
      <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}>
        <TextField
          label="Product Name"
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Fabric"
          name="fabric"
          value={newProduct.fabric}
          onChange={handleChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Color"
          name="color"
          value={newProduct.color}
          onChange={handleChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Sleeve"
          name="sleeve"
          value={newProduct.sleeve}
          onChange={handleChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          
        />
        <TextField
          label="Pattern"
          name="pattern"
          value={newProduct.pattern}
          onChange={handleChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Original Price"
          type="number"
          name="originalPrice"
          value={newProduct.originalPrice}
          onChange={handleChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Discount (%)"
          type="number"
          name="discount"
          value={newProduct.discount}
          onChange={handleChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Final Price"
          name="price"
          value={newProduct.price}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />

        {/* Size Selection */}
        <Typography>Select Size</Typography>
        <FormGroup row sx={{ marginTop: .5 }}>
          {availableSizes.map((size) => (
            <FormControlLabel
              key={size}
              control={
                <Checkbox
                size="small"
                  checked={newProduct.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
              }
              label={size}
            />
          ))}
        </FormGroup>
        
        <FormControl variant="outlined" size="small" fullWidth>
  <InputLabel>Select Category</InputLabel>
  <Select 
    value={newProduct.category || ""} 
    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
    variant="outlined"
  >
    {categories.map((category) => (
  <MenuItem key={category.id} value={category.name}>
    {category.name}
  </MenuItem>
))}
  </Select>
</FormControl>

<Button variant="contained" onClick={() => setOpenDialog(true)}>Add New Category</Button>

<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Add Category</DialogTitle>
  <DialogContent>
    <TextField 
      label="Category Name" 
      value={newCategory} 
      onChange={(e) => setNewCategory(e.target.value)} 
      size="small" 
      fullWidth 
      variant="outlined"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
    <Button onClick={handleAddCategory} color="primary" variant="contained">Save</Button>
  </DialogActions>
</Dialog>

        <input type="file" onChange={handleImagesUpload} style={{ marginTop: '16px' }} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Product Preview"
            className="preview"
            style={{ width: '100px', height: '100px', marginTop: '16px' }}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
        >
          {isEditing ? 'Update' : 'Add'}
        </Button>
      </form>
    </div>
  );
};

export default ManageProducts;
