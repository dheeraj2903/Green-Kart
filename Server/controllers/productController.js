import { v2 as cloudinary} from "cloudinary"
import Product from '../models/Product.js'
import { Readable } from 'stream';

// Cloudinary buffer stream helper function
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // upload_stream direct buffer data accept karta hai
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        quality: "auto:good",
        fetch_format: "auto"  
      },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );

    // Buffer ko stream mein convert karke cloudinary ko pipe kar rahe hai
    Readable.from(fileBuffer).pipe(stream);
  });
};

// Add product : /api/product/add
export const addProduct = async (req, res)=>{
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        if(!images || images.length === 0 ) {
            return res.json({ success: false, message: 'Please upload at least one image'})
        }

        const uploadPromises = images.map(item => uploadToCloudinary(item.buffer));
        let imagesUrl = await Promise.all(uploadPromises)

        await Product.create({...productData, image: imagesUrl})
        res.json({ success: true, message: 'Product Added' })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })      
    }
}

// Get product : /api/product/list
export const productList = async (req, res)=>{
    try {
        const products = await Product.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })   
    }
}

// // Get single product : /api/product/id
// export const productById = async (req, res)=>{
//     try {
//         const { id } = req.body
//         const products = await Product.findById(id)
//         res.json({success: true, products})
//     } catch (error) {
//         console.log(error.message)
//         res.json({ success: false, message: error.message }) 
//     }
// }

// // Change product inStock : /api/product/stock
// export const changeStock = async (req, res)=>{
//     try {
//         const { id, inStock } = req.body
//         await Product.findByIdAndUpdate(id, {inStock})
//         res.json({success: true, message: "Stock Updated"})

//     } catch (error) {
//         console.log(error.message)
//         res.json({ success: false, message: error.message })
//     }
// }


/ Get single product : /api/product/id
export const productById = async (req, res)=>{
    try {
        const { id } = req.body
        const products = await Product.findById(id)
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message }) 
    }
}

// Change product inStock : /api/product/stock
export const changeStock = async (req, res)=>{
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success: true, message: "Stock Updated"})

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}