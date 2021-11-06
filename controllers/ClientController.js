var ClientModel = require('../models/ClientModel.js');

/**
 * ClientController.js
 *
 * @description :: Server-side logic for managing Clients.
 */
module.exports = {

    /**
     * ClientController.list()
     */
    list: function (req, res) {
        ClientModel.find(function (err, Clients) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Client.',
                    error: err
                });
            }

            return res.json(Clients);
        });
    },

    /**
     * ClientController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ClientModel.findOne({_id: id}, function (err, Client) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Client.',
                    error: err
                });
            }

            if (!Client) {
                return res.status(404).json({
                    message: 'No such Client'
                });
            }

            return res.json(Client);
        });
    },

    /**
     * ClientController.create()
     */
    create: function (req, res) {
        var Client = new ClientModel({
			name : req.body.name,
			role : req.body.role
        });

        Client.save(function (err, Client) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Client',
                    error: err
                });
            }

            return res.status(201).json(Client);
        });
    },

    /**
     * ClientController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ClientModel.findOne({_id: id}, function (err, Client) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Client',
                    error: err
                });
            }

            if (!Client) {
                return res.status(404).json({
                    message: 'No such Client'
                });
            }

            Client.name = req.body.name ? req.body.name : Client.name;
			Client.role = req.body.role ? req.body.role : Client.role;
			
            Client.save(function (err, Client) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Client.',
                        error: err
                    });
                }

                return res.json(Client);
            });
        });
    },

    /**
     * ClientController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ClientModel.findByIdAndRemove(id, function (err, Client) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Client.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
