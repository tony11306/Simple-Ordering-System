import './App.css';
import React, {useState, useEffect} from 'react'
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom'
import FoodOrderPage from './pages/FoodOrderPage'
import Home from './pages/Home'
import MenuAddPage from './pages/MenuAddPage'
import MenuDeletePage from './pages/MenuDeletePage'
import IngredientManagementPage from './pages/IngredientManagementPage';
import HistoryPage from './pages/HistoryPage';
import StatisticPage from './pages/StatisticPage';

function App() {

  return(
    <div>
      <BrowserRouter>
        <nav>
          <h1>點餐系統</h1>
          <Link to="/">主頁面</Link>
          <Link to="/order">點餐</Link>
          <Link to="/add-menu">新增餐點(管理員)</Link>
          <Link to="/delete-menu">移除餐點(管理員)</Link>
          <Link to="/ingredient-management">食材管理(管理員)</Link>
          <Link to="/history">歷史訂單(管理員)</Link>
          <Link to="/statistic">銷貨統計(管理員)</Link>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/order" element={<FoodOrderPage/>}/>
            <Route path="/add-menu" element={<MenuAddPage/>}/>
            <Route path="/delete-menu" element={<MenuDeletePage/>}/>
            <Route path="/ingredient-management" element={<IngredientManagementPage/>}/>
            <Route path="/history" element={<HistoryPage/>}/>
            <Route path="/statistic" element={<StatisticPage/>}/>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App;
