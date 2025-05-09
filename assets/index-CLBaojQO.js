(function(){const m=document.createElement("link").relList;if(m&&m.supports&&m.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))y(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&y(u)}).observe(document,{childList:!0,subtree:!0});function S(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function y(o){if(o.ep)return;o.ep=!0;const l=S(o);fetch(o.href,l)}})();function D(f){if(isNaN(f)||f<0)return"Invalid Amount";if(f===0)return"Zero Naira";const m=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"],S=["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],y=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],o=["","Thousand","Million","Billion"];function l(a){let p=[];return a>=100&&(p.push(m[Math.floor(a/100)]+" Hundred"),a%=100,a>0&&p.push("And")),a>=20?(p.push(y[Math.floor(a/10)]),a%=10):a>=10&&(p.push(S[a-10]),a=0),a>0&&p.push(m[a]),p.join(" ")}let[u,v]=f.toFixed(2).split(".");u=parseInt(u,10),v=parseInt(v,10);let I=[],x=0;for(;u>0;){let a=u%1e3;if(a>0){let p=l(a);x>0&&(p+=" "+o[x]),I.unshift(p)}u=Math.floor(u/1e3),x++}let N=I.length>0?I.join(" "):"Zero",q=v>0?l(v)+" Kobo":"";return N+" Naira"+(q?" and "+q:"")}document.addEventListener("DOMContentLoaded",()=>{const f=document.getElementById("receiptForm"),m=document.getElementById("itemRows"),S=document.getElementById("addItem");let y=1;const o=/^\+?\d{10,15}$/,l=/^[A-Z0-9-]{5,20}$/,u=e=>{const t=e.toString().split(".");return t[0]=t[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),t.join(".")},v=e=>e.replace(/,/g,""),I=e=>{const t=document.createElement("div");return t.className="item-details-popover",t.id=`popover-${e}`,t.innerHTML=`
            <div class="popover-backdrop"></div>
            <div class="popover-content">
                <h3>Item Details</h3>
                <div class="popover-field">
                    <label for="itemSN-${e}">Item S/N:</label>
                    <input type="text" id="itemSN-${e}" name="itemSN" placeholder="Enter Serial Number">
                </div>
                <div class="popover-field">
                    <label for="itemMN-${e}">Item M/N:</label>
                    <input type="text" id="itemMN-${e}" name="itemMN" placeholder="Enter Model Number">
                </div>
                <div class="popover-field">
                    <label for="itemIMEI-${e}">Item IMEI:</label>
                    <input type="text" id="itemIMEI-${e}" name="itemIMEI" placeholder="Enter IMEI">
                </div>
                <div class="popover-actions">
                    <button type="button" class="save-details" aria-label="Save Details">Save</button>
                    <button type="button" class="cancel-details" aria-label="Cancel">Cancel</button>
                </div>
            </div>
        `,document.body.appendChild(t),t},x=e=>{e.style.display="flex",setTimeout(()=>{e.classList.add("visible")},10)},N=e=>{e.classList.remove("visible"),setTimeout(()=>{e.style.display="none"},300)};S.addEventListener("click",()=>{if(y>20){alert("Maximum limit of 20 rows reached!");return}const e=document.createElement("tr"),t=y;e.innerHTML=`
            <td><input type="text" name="sn" value="${y}" readonly aria-label="Serial Number"></td>
            <td><input type="text" name="name" required aria-label="Item Name"></td>
            <td><input type="text" name="description" required aria-label="Item Description"></td>
            <td>
                <button type="button" class="details-btn" aria-label="Add Item Details">Add Details</button>
                <input type="hidden" name="itemDetails" value="">
            </td>
            <td><input type="number" name="qty" min="1" required aria-label="Quantity"></td>
            <td><input type="text" name="unitPrice" required aria-label="Unit Price"></td>
            <td><input type="number" name="discount" min="0" max="100" step="0.01" aria-label="Discount Percentage"></td>
            <td><input type="text" name="amount" readonly aria-label="Amount"></td>
            <td><button type="button" class="removeItem" aria-label="Remove Item">Remove</button></td>
        `,m.appendChild(e),y++;const c=e.querySelector(".details-btn"),d=e.querySelector('input[name="itemDetails"]'),n=I(t);c.addEventListener("click",()=>{x(n)}),n.querySelector(".save-details").addEventListener("click",()=>{const s={itemSN:n.querySelector(`#itemSN-${t}`).value,itemMN:n.querySelector(`#itemMN-${t}`).value,itemIMEI:n.querySelector(`#itemIMEI-${t}`).value};d.value=JSON.stringify(s),c.textContent=s.itemSN||s.itemMN||s.itemIMEI?"Edit Details":"Add Details",N(n)}),n.querySelector(".cancel-details").addEventListener("click",()=>{N(n)}),n.querySelector(".popover-backdrop").addEventListener("click",()=>{N(n)}),e.querySelector(".removeItem").addEventListener("click",()=>{confirm("Are you sure you want to remove this item?")&&(e.remove(),n.remove(),q(),p())}),e.querySelectorAll('input[name="qty"], input[name="unitPrice"], input[name="discount"]').forEach(s=>s.addEventListener("input",a)),e.querySelector('input[name="unitPrice"]').addEventListener("input",function(){let s=v(this.value);s!==""&&!isNaN(s)&&(this.value=u(s)),a({target:this})})});const q=()=>{const e=m.querySelectorAll("tr");y=1,e.forEach(t=>{t.querySelector('input[name="sn"]').value=y++})},a=e=>{const t=e.target.closest("tr"),c=parseFloat(t.querySelector('input[name="qty"]').value)||0,d=parseFloat(v(t.querySelector('input[name="unitPrice"]').value))||0,n=parseFloat(t.querySelector('input[name="discount"]').value)||0,b=c*(d*(1-n/100));t.querySelector('input[name="amount"]').value=u(b.toFixed(2)),p()},p=()=>{const e=m.querySelectorAll("tr");let t=0,c=0,d=0;e.forEach(n=>{const b=parseFloat(n.querySelector('input[name="qty"]').value)||0,s=parseFloat(v(n.querySelector('input[name="unitPrice"]').value))||0,g=parseFloat(n.querySelector('input[name="discount"]').value||0);t+=b,c+=b*s,d+=b*(s*(1-g/100))}),document.getElementById("itemQty").textContent=t,document.getElementById("subTotal").textContent=c.toLocaleString("en-NG",{minimumFractionDigits:2}),document.getElementById("total").textContent=d.toLocaleString("en-NG",{minimumFractionDigits:2}),document.getElementById("amountInWords").textContent=D(d)};f.addEventListener("submit",e=>{e.preventDefault();const t=document.getElementById("customerName").value.trim(),c=document.getElementById("phoneNumber").value.trim(),d=document.getElementById("invoiceNumber").value.trim();if(!o.test(c)){alert("Please enter a valid phone number (10-15 digits).");return}if(!l.test(d)){alert("Invoice number must be 5-20 characters (letters, numbers, or hyphens).");return}const n=f.querySelector('button[type="submit"]');n.disabled=!0,n.textContent="Processing...";const b=m.querySelectorAll("tr"),s=Array.from(b).map((L,r)=>{const i=L.querySelectorAll("input"),h=JSON.parse(i[3].value||"{}");return{sn:r+1,name:i[1].value,description:i[2].value,itemDetails:h,qty:parseInt(i[4].value)||0,unitPrice:parseFloat(v(i[5].value))||0,discount:parseFloat(i[6].value)||0,amount:parseFloat(v(i[7].value))||0}}),g={customerName:t,phoneNumber:c,invoiceNumber:d,date:document.getElementById("date").value,paymentMode:document.getElementById("paymentMode").value,items:s,itemQty:parseInt(document.getElementById("itemQty").textContent)||0,subTotal:parseFloat(v(document.getElementById("subTotal").textContent))||0,total:parseFloat(v(document.getElementById("total").textContent))||0,amountInWords:document.getElementById("amountInWords").textContent},M=JSON.parse(localStorage.getItem("receipts")||"[]");M.push({id:Date.now(),...g}),localStorage.setItem("receipts",JSON.stringify(M)),localStorage.setItem("receiptData",JSON.stringify(g)),n.disabled=!1,n.textContent="Generate Receipt",window.open("/receipt.html","_blank")});const E=document.createElement("button");E.type="button",E.textContent="Clear All Items",E.style.marginLeft="10px",S.insertAdjacentElement("afterend",E),E.addEventListener("click",()=>{confirm("Are you sure you want to clear all items?")&&(m.innerHTML="",document.querySelectorAll(".item-details-popover").forEach(e=>e.remove()),y=1,p())});const w=document.createElement("button");w.type="button",w.textContent="View Past Receipts",w.style.marginTop="10px",f.appendChild(w),w.addEventListener("click",()=>{const e=JSON.parse(localStorage.getItem("receipts")||"[]"),t=document.createElement("div");t.style.cssText="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;",t.innerHTML=`
            <div style="background: white; padding: 20px; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <h3>Past Receipts</h3>
                <div style="margin-bottom: 15px;">
                    <input type="text" id="searchReceipts" placeholder="Search by Invoice, Name, or Date" style="width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="sortReceipts" style="margin-right: 10px;">Sort by:</label>
                    <select id="sortReceipts" style="padding: 8px; border: 1px solid #ced4da; border-radius: 4px;">
                        <option value="date-desc">Date (Newest First)</option>
                        <option value="date-asc">Date (Oldest First)</option>
                        <option value="invoice">Invoice Number</option>
                    </select>
                </div>
                <ul id="receiptList" style="list-style: none; padding: 0;"></ul>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button id="closeModal" style="padding: 8px 16px; background: #790707; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                </div>
            </div>
        `,document.body.appendChild(t);const c=t.querySelector("#searchReceipts"),d=t.querySelector("#sortReceipts"),n=t.querySelector("#receiptList"),b=t.querySelector("#closeModal"),s=r=>{n.innerHTML=r.map(i=>`
                <li style="padding: 10px; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;">
                    <span>Invoice #${i.invoiceNumber} - ${i.customerName} - ${i.date}</span>
                    <div>
                        <button onclick="viewReceipt(${i.id})" style="margin-right: 10px; padding: 5px 10px; background: #022142; color: white; border: none; border-radius: 4px; cursor: pointer;">View</button>
                        <button onclick="deleteReceipt(${i.id})" style="padding: 5px 10px; background: #790707; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
                    </div>
                </li>
            `).join("")},g=(r,i)=>[...r].sort((h,C)=>i==="date-desc"?new Date(C.date)-new Date(h.date):i==="date-asc"?new Date(h.date)-new Date(C.date):i==="invoice"?h.invoiceNumber.localeCompare(C.invoiceNumber):0),M=r=>(r=r.toLowerCase(),e.filter(i=>i.invoiceNumber.toLowerCase().includes(r)||i.customerName.toLowerCase().includes(r)||i.date.toLowerCase().includes(r))),L=()=>{let r=M(c.value);r=g(r,d.value),s(r)};c.addEventListener("input",L),d.addEventListener("change",L),s(g(e,"date-desc")),window.deleteReceipt=r=>{if(confirm("Are you sure you want to delete this receipt?")){const i=e.filter(h=>h.id!==r);localStorage.setItem("receipts",JSON.stringify(i)),L()}},b.addEventListener("click",()=>{t.remove()}),t.addEventListener("click",r=>{r.target===t&&t.remove()})}),window.viewReceipt=e=>{const c=JSON.parse(localStorage.getItem("receipts")||"[]").find(d=>d.id===e);c&&(localStorage.setItem("receiptData",JSON.stringify(c)),window.open("/receipt.html","_blank"))}});
//# sourceMappingURL=index-CLBaojQO.js.map
