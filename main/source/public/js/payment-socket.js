<script>
  document.addEventListener('DOMContentLoaded', function() {
    const payButton = document.getElementById('payButton');

    payButton.addEventListener('click', function() {
        const userId = 'USER_ID'; // Replace with actual user ID
        const totalPriceElement = document.getElementById('showTotalMoney');
        let totalPrice = totalPriceElement.innerText;
        totalPrice = totalPrice.replace(/\D/g,''); // Remove non-numeric characters

        const noteElement = document.getElementById('description');
        const note = noteElement.value; // Get the value of the note textarea

        fetch('/order/CreatAndSendToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                totalAmount: totalPrice, 
                userId: userId,
                note: note // Include the note in the data sent
            }),
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors (e.g., show an error message)
        });
    });
});

</script>