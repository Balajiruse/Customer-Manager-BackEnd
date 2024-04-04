
import express from "express";
import { deleteIncome, editIncome, getAllIncome, getIncome, newIncome } from "../Controllers/Account/income.js";

const router = express.Router();

//Get income
router.get("/allIncome/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: "Bad Request", message: "userId is required" });
    }

    // Get Income
    const data = await getAllIncome(userId);

    if (!data) {
      return res.status(404).json({ error: "Not Found", message: "Details not found"  });
    }
    if(data.length==0){
        return res.status(404).json({ error: "Data is empty", message: "Income is not updated"  });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});


//Add Income
router.post("/addincome", async (req, res) => {
    try {
      // Checking if the details are filled
      if (Object.keys(req.body).length <= 0) {
        return res
          .status(400)
          .json({ error: "Invalid request, Enter the details" });
      }

  const type="income"
      // Validation
      const {  category, Amount, date ,userId} = req.body;
  
      if ( !category || !Amount  || !type || !date) {
        return res.status(400).json({ error: "Please fill in all fields" });
      }
      if (!userId) {
        return res
          .status(401)
          .json({ error: "User not authenticated  Kindly Login again" });
      }
      const newdata = { userId,type, ...req.body };
      await newIncome(newdata);
  
      res.status(200).json({ data: "Income added successfully", newdata });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  });


  //delete Income
router.delete("/deleteIncome/:id", async (req, res) => {
    try {
      const id = req.params.id;
      //check product
      const Income = await getIncome(id);
  
      // if Income doesnt exist
      if (!Income) {
        res.status(404).json("details not found");
      }
      // delete the item
      const deleted = await deleteIncome(id);
      // checking whether deleted or not
      if (!deleted) {
        res.status(500).json({ error: "Failed to delete Income" });
      }
  
      res.status(200).json({ data: "Income deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  });

// Edit Income
  router.put("/editIncome/:id", async (req, res) => {
    try {
      const id = req.params.id;
      //check product
      const Income = await getIncome( id);
  
      // if Income doesnt exist
      if (!Income) {
        res.status(404);
        throw new Error("Income not found");
      }
  
      //update edited
      const edited={...req.body}
  
      //save in DB
     const updateddata= await editIncome(id,edited)
  
  
      res.status(200).json({ data: "Income  updated successfully",updateStatus:updateddata,edited });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  });
  

export const IncomeRouter = router;
