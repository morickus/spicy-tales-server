import { Router } from 'express'
import { createArticle, getArticles, getArticleById } from '../controllers/articles.js'
const router = new Router()

router.post('/', createArticle)

router.get('/', getArticles)

router.get('/:id', getArticleById)

export default router