import Article from '../models/Article.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

export const createArticle = async (req, res) => {
	try {
		const {title, text, category, tags} = req.body

		let fileName = String(performance.now()).replace('.', '') + Date.now().toString()
		const __dirname = dirname(fileURLToPath(import.meta.url))
		const file = path.join(__dirname, '..', 'text', `${fileName}.txt`)

		fs.writeFile(file, text, async (error) => {
			if (error) {
				return res.status(500).json(error)
			}

			let shortDescription = text.substring(0, 100)

			const newArticle = new Article({
				title,
				fileName,
				shortDescription,
				category,
				tags
			})

			await newArticle.save()
			return res.json({data: newArticle})
		})
	} catch (e) {
		return res.status(500).json(e)
	}
}

export const getArticles = async (req, res) => {
	try {
		const {offset = 0, limit = 10, sort = '-createdAt'} = req.body

		const articles = await Article.aggregate([
			{
				$facet: {
					metadata: [{$count: 'totalCount'}],
					data: [{$sort: {createdAt: -1}}, {$skip: offset}, {$limit: limit}],
				},
			},
		])

		const __dirname = dirname(fileURLToPath(import.meta.url))
		const readFilePromise = (item) => {
			return new Promise((resolve, reject) => {
				const pathFile = path.join(__dirname, '..', 'text', `${item.fileName}.txt`)
				fs.readFile(pathFile, 'utf-8', (err, data) => {
					if (err) {
						reject(err)
					} else {
						resolve({...item, text: data.toString()})
					}
				})
			})
		}

		Promise.all(articles[0].data.map(i => readFilePromise(i)))
			.then((data) => {
				return res.json({
					data,
					metadata: {totalCount: articles[0].metadata[0].totalCount, offset, limit}
				})
			})
	} catch (e) {
		return res.status(500).json(e)
	}
}

export const getArticleById = async (req, res) => {
	try {
		const article = await Article.findOneAndUpdate({_id: req.params.id}, {
			$inc: {views: 1},
		})

		if (!article) {
			return res.status(404).json()
		}

		const __dirname = dirname(fileURLToPath(import.meta.url))
		const file = path.join(__dirname, '..', 'text', `${article.fileName}.txt`)
		fs.readFile(file, 'utf-8', async (error, data) => {
			if (error) {
				return res.status(500).json(error)
			}
			// TODO: fix article._doc
			return res.json({data: {...article._doc, text: data}})
		})
	} catch (e) {
		return res.status(500).json(e)
	}
}