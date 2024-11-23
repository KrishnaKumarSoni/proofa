I'll help write a comprehensive markdown requirements document that incorporates both the existing requirements and CrewAI concepts. I'll reference the existing requirements using line numbers.

# EPOD System Requirements

## System Overview
WhatsApp-based Electronic Proof of Delivery (EPOD) system using CrewAI agents for intelligent processing and management.

## Core Agents

### 1. Authentication Agent
- **Role**: Driver verification and session management
- **Tools**: SQLite, Session Manager
- **Responsibilities**:
  - Phone number verification
  - Session timeout handling
  - Active status tracking


### 2. EPOD Processing Agent
- **Role**: Image and OCR processing
- **Tools**: Claude Vision, Image Validator
- **Responsibilities**:
  - Image validation and processing
  - OCR execution and metadata extraction
  - Retry management


### 3. Trip Management Agent
- **Role**: Trip data and submission handling
- **Tools**: Local Cache, Trip Validator
- **Responsibilities**:
  - Trip data management
  - EPOD submission handling
  - Status tracking


## Process Flows

### 1. Authentication Flow
- Driver initiates WhatsApp conversation
- System verifies phone number
- Session creation/validation
- Menu display



### 2. EPOD Submission Flow
1. Location sharing
2. Image upload
3. OCR processing
4. Trip association
5. Confirmation



### 3. Error Handling Flow
- OCR failure handling
- Manual trip selection
- API retry mechanism


## Technical Specifications

### 1. Storage
- SQLite for driver data
- File system for image cache
- Local JSON for trip data

### 2. Session Management

- 24 hour session validity
- 30 minute inactivity timeout
- FIFO queue for concurrent submissions


### 3. Error Handling
- 3 retries with exponential backoff
- 30 second API timeout
- Cached responses for common Claude queries

### 4. CrewAI Configuration
- Process: Sequential
- Planning: Enabled
- Memory: Local file system
- Verbose logging: Enabled for debugging
- Rate limiting: 30 requests per minute
- Language: English
- Full output: Enabled for debugging

### 5. Agent Collaboration
- Shared memory for context
- Sequential process flow
- Local PDF documentation access
- No external API calls for documentation

## MVP Limitations
1. Local storage only
2. Basic retry mechanism
3. Simple FIFO queue
4. Minimal caching
5. Basic session management
6. Placeholder Freight Tiger API integration

## Future Enhancements
1. Distributed storage
2. Advanced queue management
3. Sophisticated caching
4. Enhanced security measures
5. Real Freight Tiger API integration

