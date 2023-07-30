// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Campaign {
    struct CampaignData {
        address creator;
        uint256 goal;
        uint256 raisedAmount;
        bool isClosed;
        mapping(address => uint256) contributions;
    }

    CampaignData[] public campaigns;

    event CampaignCreated(address indexed creator, uint256 indexed campaignId);
    event ContributionMade(address indexed contributor, uint256 indexed campaignId, uint256 amount);
    event CampaignClosed(uint256 indexed campaignId, bool isSuccessful);

    function createCampaign(uint256 _goal) external {
        CampaignData memory newCampaign = CampaignData({
            creator: msg.sender,
            goal: _goal,
            raisedAmount: 0,
            isClosed: false
        });

        campaigns.push(newCampaign);
        emit CampaignCreated(msg.sender, campaigns.length - 1);
    }

    function contribute(uint256 _campaignId) external payable {
        require(_campaignId < campaigns.length, "Campaign does not exist");
        require(!campaigns[_campaignId].isClosed, "Campaign is closed");
        require(msg.value > 0, "Contribution amount must be greater than 0");

        campaigns[_campaignId].contributions[msg.sender] += msg.value;
        campaigns[_campaignId].raisedAmount += msg.value;

        emit ContributionMade(msg.sender, _campaignId, msg.value);

        if (campaigns[_campaignId].raisedAmount >= campaigns[_campaignId].goal) {
            campaigns[_campaignId].isClosed = true;
            emit CampaignClosed(_campaignId, true);
        }
    }

    function getCampaignDetails(uint256 _campaignId)
        external
        view
        returns (
            address creator,
            uint256 goal,
            uint256 raisedAmount,
            bool isClosed
        )
    {
        require(_campaignId < campaigns.length, "Campaign does not exist");

        CampaignData storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.goal,
            campaign.raisedAmount,
            campaign.isClosed
        );
    }
}
