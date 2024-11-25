// import {
//   Grid,
//   Box,
//   Card,
//   Collapse,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useState } from "react";

// const Portfolio = ({
//   cryptoSymbol,
//   setCryptoSymbol,
//   amount,
//   setAmount,
//   handleAddAsset,
//   loading,
//   suggestedSymbols,
//   searchCoinBySymbol,
//   portfolio,
//   handleEditAsset,
//   openDeleteConfirmation,
//   openDeleteDialog,
//   closeDeleteConfirmation,
//   handleDeleteAsset,
// }) => {
//   // New state to handle the collapse for mobile
//   const [expanded, setExpanded] = useState(false);

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//   };

//   return (
//     <Grid container spacing={2} sx={{ padding: "2rem" }}>
//       {/* Main Content (Chart + Portfolio Details) */}
//       <Grid item xs={12} md={8}>
//         <Box>
//           <PortfolioChart />
//           <PortfolioDetails
//             assets={portfolio.assets}
//             loading={loading}
//             handleEditAsset={handleEditAsset}
//             openDeleteConfirmation={openDeleteConfirmation}
//             totalValueUSD={portfolio.assets.reduce(
//               (acc, asset) => acc + asset.amount * asset.priceUSD,
//               0
//             )}
//             totalValueEUR={portfolio.assets.reduce(
//               (acc, asset) => acc + asset.amount * asset.priceEUR,
//               0
//             )}
//           />
//           <DeleteConfirmationDialog
//             open={openDeleteDialog}
//             onClose={closeDeleteConfirmation}
//             onDelete={handleDeleteAsset}
//           />
//         </Box>
//       </Grid>

//       {/* AddAssetForm Sidebar for Desktop */}
//       <Grid item xs={12} md={4}>
//         {/* Desktop View */}
//         <Box
//           sx={{
//             display: { xs: "none", md: "block" },
//             backgroundColor: "background.paper",
//             padding: "1rem",
//             borderRadius: "8px",
//           }}
//         >
//           <AddAssetForm
//             cryptoSymbol={cryptoSymbol}
//             setCryptoSymbol={setCryptoSymbol}
//             amount={amount}
//             setAmount={setAmount}
//             addAsset={handleAddAsset}
//             loading={loading}
//             suggestedSymbols={suggestedSymbols}
//             searchCoinBySymbol={searchCoinBySymbol}
//           />
//         </Box>

//         {/* Mobile Collapsible Card */}
//         <Box
//           sx={{
//             display: { xs: "block", md: "none" },
//           }}
//         >
//           <Card
//             sx={{
//               marginBottom: "1rem",
//               padding: "1rem",
//               backgroundColor: "background.paper",
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Typography variant="h6">Add Cryptocurrency</Typography>
//               <IconButton onClick={handleExpandClick}>
//                 <ExpandMoreIcon
//                   sx={{
//                     transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
//                     transition: "transform 0.3s ease-in-out",
//                   }}
//                 />
//               </IconButton>
//             </Box>
//             <Collapse in={expanded}>
//               <AddAssetForm
//                 cryptoSymbol={cryptoSymbol}
//                 setCryptoSymbol={setCryptoSymbol}
//                 amount={amount}
//                 setAmount={setAmount}
//                 addAsset={handleAddAsset}
//                 loading={loading}
//                 suggestedSymbols={suggestedSymbols}
//                 searchCoinBySymbol={searchCoinBySymbol}
//               />
//             </Collapse>
//           </Card>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };

// export default Portfolio;
