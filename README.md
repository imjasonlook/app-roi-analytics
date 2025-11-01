
# App ROI 数据分析系统

基于 Next.js + Express + MySQL 的多时间维度 ROI 可视化系统。支持 CSV 批量导入、筛选与交互、7 日移动平均、线性/对数坐标、100% 回本线等。

## 快速开始

### 环境
- Node.js 18+
- MySQL 8.0+
- npm

### 启动后端
```bash
cd backend
cp .env.example .env
npm i
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 启动前端
```bash
cd ../frontend
cp .env.local.example .env.local   # NEXT_PUBLIC_BACKEND=http://localhost:4000
npm i
npm run dev
```

### 访问
- 前端：http://localhost:3000
- 后端：http://localhost:4000

## 子目录
- `backend/` Express + TS + Prisma
- `frontend/` Next.js 14 + Tailwind + Recharts
