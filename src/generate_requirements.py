import os
from datetime import datetime

class RequirementsGenerator:
    def __init__(self):
        self.requirements = []
        self.agent_definitions = []
        self.process_flows = []
        
    def generate_agent_definitions(self):
        self.agent_definitions = [
            {
                "name": "AuthenticationAgent",
                "role": "Authentication & Session Management",
                "goal": "Handle driver verification and manage active sessions",
                "tools": ["SQLite", "Session Manager"],
                "prompt": """You are an authentication specialist responsible for:
- Verifying driver phone numbers against local database
- Managing session timeouts and validity
- Tracking driver active status
- Handling concurrent session management"""
            },
            {
                "name": "EPODProcessingAgent",
                "role": "Image Processing & OCR",
                "goal": "Process uploaded images and extract metadata",
                "tools": ["Claude Vision", "Image Validator"],
                "prompt": """You are an EPOD processing specialist responsible for:
- Validating image formats and sizes
- Processing images through OCR
- Extracting relevant metadata
- Managing upload retries and failures"""
            },
            {
                "name": "TripManagementAgent",
                "role": "Trip Data Handler",
                "goal": "Manage trip data and EPOD submissions",
                "tools": ["Local Cache", "Trip Validator"],
                "prompt": """You are a trip management specialist responsible for:
- Managing trip data locally
- Validating EPOD submissions
- Handling trip selection
- Managing submission status"""
            }
        ]

    def generate_process_flows(self):
        self.process_flows = [
            {
                "name": "Authentication Flow",
                "steps": [
                    "Driver sends message to WhatsApp bot",
                    "Bot verifies phone number in local database",
                    "Bot creates/validates session",
                    "Bot responds with menu options"
                ]
            },
            {
                "name": "EPOD Submission Flow",
                "steps": [
                    "Driver selects EPOD submission option",
                    "Bot requests location",
                    "Driver shares location",
                    "Bot requests POD images",
                    "Driver uploads images",
                    "Bot processes images via Claude Vision",
                    "Bot validates and stores submission"
                ]
            }
        ]

    def generate_technical_specs(self):
        return """
### Technical Specifications

1. **Local Storage**
   - SQLite database for driver data
   - File system for image cache
   - Local JSON for trip data cache

2. **Image Processing**
   - Max images: 50 per submission
   - Max size: 16MB per image
   - Formats: jpeg, jpg, png
   - Retry attempts: 3

3. **Session Management**
   - Validity: 24 hours
   - Inactivity timeout: 30 minutes
   - Concurrent handling: FIFO queue

4. **Documentation**
   - Source: Local PDF files in /docs
   - Access: Direct file system
   - Format: PDF reader with text extraction

5. **Error Handling**
   - Retry mechanism: Exponential backoff
   - Max retries: 3
   - Timeout: 30 seconds
"""

    def generate_markdown(self):
        self.generate_agent_definitions()
        self.generate_process_flows()
        
        markdown = f"""# EPOD System Requirements
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## System Overview
WhatsApp-based EPOD (Electronic Proof of Delivery) system using autonomous agents for processing and management.

## Agent Definitions
"""
        
        for agent in self.agent_definitions:
            markdown += f"""
### {agent['name']}
- **Role:** {agent['role']}
- **Goal:** {agent['goal']}
- **Tools:** {', '.join(agent['tools'])}

**Prompt Template:**

{agent['prompt']}
"""

        markdown += "\n## Process Flows\n"
        for flow in self.process_flows:
            markdown += f"\n### {flow['name']}\n"
            for i, step in enumerate(flow['steps'], 1):
                markdown += f"{i}. {step}\n"

        markdown += "\n" + self.generate_technical_specs()

        return markdown

    def save_requirements(self, output_path="requirements.md"):
        markdown = self.generate_markdown()
        with open(output_path, 'w') as f:
            f.write(markdown)
        print(f"Requirements saved to {output_path}")

if __name__ == "__main__":
    generator = RequirementsGenerator()
    generator.save_requirements()
