const VotingSystem = require('./VotingSystem');
const Vote = require('./Vote');
const Election = require('./Election');
const VotingController = require('./VotingController');
const { router: votingRoutes, initVotingRoutes } = require('./votingRoutes');

/**
 * Voting Module - Complete voting system for blockchain applications
 * 
 * Features:
 * - Ed25519 and secp256k1 cryptographic signatures
 * - Flexible election configuration
 * - Multiple voting types (single choice, multiple choice, ranked)
 * - Voter registration and validation
 * - Real-time results calculation
 * - Blockchain integration for vote integrity
 * - Comprehensive API endpoints
 * - Audit logging and security features
 * 
 * Usage:
 * const { VotingSystem, initVotingRoutes } = require('./modules/voting');
 * 
 * // Initialize with existing blockchain
 * const votingSystem = new VotingSystem(blockchain);
 * 
 * // Setup API routes
 * const votingRoutes = initVotingRoutes(blockchain);
 * app.use('/api/voting', votingRoutes);
 */

module.exports = {
    // Core classes
    VotingSystem,
    Vote,
    Election,
    VotingController,
    
    // Routes
    votingRoutes,
    initVotingRoutes,
    
    // Configuration helpers
    createDefaultConfig: () => ({
        minConfirmations: 1,
        voteValidationTimeout: 30000,
        maxElectionsPerNode: 100,
        requireVoterRegistration: false,
        defaultVotingType: 'SINGLE_CHOICE',
        defaultCurve: 'ed25519'
    }),
    
    // Election type constants
    ELECTION_STATUS: {
        CREATED: 'CREATED',
        ACTIVE: 'ACTIVE', 
        ENDED: 'ENDED',
        CANCELLED: 'CANCELLED'
    },
    
    VOTING_TYPES: {
        SINGLE_CHOICE: 'SINGLE_CHOICE',
        MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
        RANKED: 'RANKED'
    }
};
