import streamlit as st

st.set_page_config(page_title="Omni Digital Holdings - Business Tax & LLC Calculator", layout="centered")

st.title("💼 Business Tax & LLC Savings Calculator")
st.write("Calculate your estimated self-employment tax savings by structuring your business as an LLC with an S-Corp election.")

# User Inputs
revenue = st.number_input("Expected Annual Gross Revenue ($)", min_value=10000, max_value=5000000, value=120000, step=5000)
expenses = st.number_input("Expected Annual Business Expenses ($)", min_value=1000, max_value=1000000, value=20000, step=1000)
salary = st.number_input("Reasonable W-2 Salary ($)", min_value=10000, max_value=300000, value=60000, step=5000)

if st.button("Calculate Potential Savings"):
    net_profit = revenue - expenses
    
    if salary >= net_profit:
        st.warning("Your salary cannot exceed or equal your total net profit. Adjust your inputs.")
    else:
        # Standard Sole Proprietorship Self-Employment Tax (approx 15.3% on 92.35% of net profit)
        solep_tax = net_profit * 0.9235 * 0.153
        
        # LLC S-Corp Self-Employment Tax (taxed only on W-2 salary)
        scorp_tax = salary * 0.9235 * 0.153
        
        annual_savings = solep_tax - scorp_tax
        
        st.success(f"### Estimated Annual Tax Savings: ${annual_savings:,.2f}")
        
        st.write("---")
        st.write("### Next Steps to Capture These Savings")
        st.write("To legally lock in these tax advantages, your business must be properly structured and registered.")
        
        # High-paying B2B Affiliate Callout
        st.info(
            "**Recommended Action:** Don't risk state rejection fees or IRS compliance flags by filing paperwork manually. "
            "Use a verified formation service to set up your entity correctly in minutes.\n\n"
            "👉 [Form Your LLC & Protect Your Business Today](https://www.awin1.com/cread.php?awinmid=66946&awinaffid=2775906) *(Sponsored Partner)*"
        )
