document.addEventListener("DOMContentLoaded", async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        init();
      } catch (error) {
        console.error("Access to your Ethereum account rejected.");
      }
    } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      init();
    } else {
      console.error("No Ethereum provider detected. Please install MetaMask.");
    }
  });
  
  const init = () => {
    const contractAddress = "CONTRACT_ADDRESS"; // Replace with your deployed contract address
    const contractAbi = [
      // Replace with your deployed contract ABI
    ];
  
    const crowdfundingContract = new web3.eth.Contract(contractAbi, contractAddress);
  
    document.getElementById("createCampaignForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const goal = event.target.goal.value;
      await createCampaign(goal);
      event.target.reset();
    });
  
    const createCampaign = async (goal) => {
      const accounts = await web3.eth.getAccounts();
      try {
        await crowdfundingContract.methods.createCampaign(web3.utils.toWei(goal, "ether")).send({ from: accounts[0] });
        alert("Campaign created successfully!");
        displayCampaigns();
      } catch (error) {
        console.error("Error creating campaign:", error);
      }
    };
  
    const displayCampaigns = async () => {
      const campaignsListDiv = document.getElementById("campaignsList");
      campaignsListDiv.innerHTML = "";
  
      const campaignsCount = await crowdfundingContract.methods.campaigns.length().call();
      for (let i = 0; i < campaignsCount; i++) {
        const campaign = await crowdfundingContract.methods.getCampaignDetails(i).call();
        const isClosed = campaign[3] ? "Closed" : "Open";
        const campaignDiv = document.createElement("div");
        campaignDiv.innerHTML = `
          <strong>Campaign ID:</strong> ${i}<br>
          <strong>Creator:</strong> ${campaign[0]}<br>
          <strong>Goal:</strong> ${web3.utils.fromWei(campaign[1], "ether")} ETH<br>
          <strong>Raised Amount:</strong> ${web3.utils.fromWei(campaign[2], "ether")} ETH<br>
          <strong>Status:</strong> ${isClosed}<br>
          <hr>
        `;
        campaignsListDiv.appendChild(campaignDiv);
      }
    };
  
    displayCampaigns();
  };
  