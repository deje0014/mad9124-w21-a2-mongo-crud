const express = require('express')
const router = express.Router()
const sanitizeMongo = require('express-mongo-sanitize')
const sanitizeBody = require('../middleware/sanitizeBody')
const Course = require('../models/Course')

router.get('/', async (req, res) => {
    const course = await Course.find()
    res.send({data: course})
})

// POST
router.post('/', sanitizeMongo(), sanitizeBody, async (req, res) => {
    let newCourse = new Course(req.sanitizedBody)
    await newCourse.save()
    res.status(201).send({data: newCourse})
})

// GET
router.get('/:id', async (req, res) => {
    try {
        const course = await (await Course.findById(req.params.id)).populate('students')
        if (!course) throw new Error('Resource not found')
        res.send({data: course})
      } catch (err) {
        sendResourceNotFound(req, res)
      }
})

// PUT
router.put('/:id', sanitizeMongo(), sanitizeBody, async (req, res) => {
    try {
        const {_id, ...otherAttributes} = req.sanitizedBody
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            {_id: req.params.id, ...otherAttributes},
            {
                new: true,
                overwrite: true,
                runValidators: true
            }
        )
        if(!course) throw new Error('Resource not found')
        res.send({data: course})
    } catch (err){
        sendResourceNotFound(req, res)
    }

})

// Patch
router.patch('/:id', sanitizeMongo(), sanitizeBody, async (req, res) => {
    try {
        const {_id, ...otherAttributes} = req.sanitizedBody
        const course = await Course.findByIdAndUpdate(
          req.params.id,
          {_id: req.params.id, ...otherAttributes},
          {
            new: true,
            runValidators: true
          }
        )
        if (!course) throw new Error('Resource not found')
        res.send({data: course})
      } catch (err) {
        sendResourceNotFound(req, res)
      }

})
// Delete
router.delete('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndRemove(req.params.id)
        if (!course) throw new Error('Resource not found')
        res.send({data: course})
      } catch (err) {
        sendResourceNotFound(req, res)
      }
})

function sendResourceNotFound(req, res) {
    res.status(404).send({
      errors: [
        {
          status: '404',
          title: 'Resource does not exist',
          description: `We could not find a course with id: ${req.params.id}`
        }
      ]
    })
  }

module.exports = router