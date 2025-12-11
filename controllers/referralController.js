// controllers/referralController.js
import ReferralCode from "../models/ReferralCode.js";

/* ----------------------------------------
   ADD MULTIPLE REFERRAL CODES
---------------------------------------- */
export const addReferralCodes = async (req, res) => {
  try {
    let { codes } = req.body;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({ message: "Codes must be an array." });
    }

    const results = { added: [], skipped: [] };

    for (const code of codes) {
      const exists = await ReferralCode.findOne({ code });

      if (exists) {
        results.skipped.push(code);
        continue;
      }

      const newCode = await ReferralCode.create({ code, valid: true });
      results.added.push(newCode.code);
    }

    return res.status(201).json({
      message: "Referral codes processed",
      results
    });

  } catch (err) {
    console.error("Referral code add error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ----------------------------------------
   GET ALL REFERRAL CODES
---------------------------------------- */
export const getReferralCodes = async (req, res) => {
  try {
    const codes = await ReferralCode.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (err) {
    console.error("Fetch referral error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ----------------------------------------
   DELETE REFERRAL CODE
---------------------------------------- */
export const deleteReferralCode = async (req, res) => {
  try {
    const { code } = req.params;

    const deleted = await ReferralCode.findOneAndDelete({ code });

    if (!deleted) {
      return res.status(404).json({ message: "Code not found" });
    }

    res.json({ message: "Referral code removed", deleted });
  } catch (err) {
    console.error("Delete referral error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ----------------------------------------
   TOGGLE VALID / INVALID
---------------------------------------- */
export const toggleReferralStatus = async (req, res) => {
  try {
    const { code } = req.params;

    const referral = await ReferralCode.findOne({ code });

    if (!referral) {
      return res.status(404).json({ message: "Code not found" });
    }

    referral.valid = !referral.valid;
    await referral.save();

    res.json({ message: "Status updated", referral });
  } catch (err) {
    console.error("Toggle referral error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
