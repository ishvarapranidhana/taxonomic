import DocumentationPanel, { APIEndpoint } from '@/components/DocumentationPanel'

// Mock API endpoints
const mockEndpoints: APIEndpoint[] = [
  {
    id: 'get-taxonomies',
    method: 'GET',
    path: '/api/taxonomies',
    description: 'Retrieve all taxonomies with optional filtering',
    parameters: [
      {
        name: 'domain',
        type: 'string',
        required: false,
        description: 'Filter by domain suffix',
        example: 'ACME.COM'
      },
      {
        name: 'project',
        type: 'string',
        required: false,
        description: 'Filter by project ID',
        example: 'ACME-MARKETING2023'
      },
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Maximum number of results',
        example: '50'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Successfully retrieved taxonomies',
        example: {
          taxonomies: [
            {
              id: 'uuid-123-456',
              taxonomicId: 'ACME.COM/004/ACME-MARKETING2023/MARKETING,BRANDING/UX,SOFTWARE/WEBSITE/20231003070000',
              domainSuffix: 'ACME.COM',
              projectId: 'ACME-MARKETING2023',
              aspectTags: ['MARKETING', 'BRANDING'],
              areaHierarchies: ['UX', 'SOFTWARE'],
              childNodes: ['WEBSITE'],
              timestamp: '20231003070000',
              md5Hash: 'a1b2c3d4e5f6'
            }
          ],
          totalCount: 1247,
          page: 1,
          limit: 50
        }
      }
    ],
    examples: [
      {
        name: 'Get all taxonomies',
        description: 'Retrieve all taxonomies without filtering',
        request: {
          method: 'GET',
          url: '/api/taxonomies',
          headers: {
            'Authorization': 'Bearer your-api-key',
            'Content-Type': 'application/json'
          }
        },
        response: {
          status: 200,
          body: {
            taxonomies: [],
            totalCount: 1247,
            page: 1,
            limit: 50
          }
        }
      },
      {
        name: 'Filter by domain',
        description: 'Get taxonomies for a specific domain',
        request: {
          method: 'GET',
          url: '/api/taxonomies?domain=ACME.COM&limit=10',
          headers: {
            'Authorization': 'Bearer your-api-key'
          }
        },
        response: {
          status: 200,
          body: {
            taxonomies: [],
            totalCount: 23,
            page: 1,
            limit: 10
          }
        }
      }
    ]
  },
  {
    id: 'create-taxonomy',
    method: 'POST',
    path: '/api/taxonomies',
    description: 'Create a new taxonomic structure',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {
          domainSuffix: { type: 'string' },
          projectId: { type: 'string' },
          aspectTags: { type: 'array', items: { type: 'string' } },
          areaHierarchies: { type: 'array', items: { type: 'string' } },
          childNodes: { type: 'array', items: { type: 'string' } }
        },
        required: ['domainSuffix', 'projectId', 'aspectTags', 'areaHierarchies', 'childNodes']
      },
      example: {
        domainSuffix: 'ACME.COM',
        projectId: 'ACME-MARKETING2024',
        aspectTags: ['MARKETING', 'DIGITAL'],
        areaHierarchies: ['UX', 'MOBILE'],
        childNodes: ['APP']
      }
    },
    responses: [
      {
        status: 201,
        description: 'Taxonomy created successfully',
        example: {
          id: 'uuid-new-taxonomy',
          taxonomicId: 'ACME.COM/004/ACME-MARKETING2024/MARKETING,DIGITAL/UX,MOBILE/APP/20231003120000',
          message: 'Taxonomy created and validated'
        }
      },
      {
        status: 400,
        description: 'Invalid taxonomy format',
        example: {
          error: 'BNF_VALIDATION_ERROR',
          message: 'Project ID format is invalid'
        }
      }
    ],
    examples: [
      {
        name: 'Create taxonomy',
        description: 'Create a new taxonomy with all required fields',
        request: {
          method: 'POST',
          url: '/api/taxonomies',
          headers: {
            'Authorization': 'Bearer your-api-key',
            'Content-Type': 'application/json'
          },
          body: {
            domainSuffix: 'ACME.COM',
            projectId: 'ACME-MARKETING2024',
            aspectTags: ['MARKETING', 'DIGITAL'],
            areaHierarchies: ['UX', 'MOBILE'],
            childNodes: ['APP']
          }
        },
        response: {
          status: 201,
          body: {
            id: 'uuid-new-taxonomy',
            taxonomicId: 'ACME.COM/004/ACME-MARKETING2024/MARKETING,DIGITAL/UX,MOBILE/APP/20231003120000',
            message: 'Taxonomy created and validated'
          }
        }
      }
    ]
  },
  {
    id: 'get-provenance',
    method: 'GET',
    path: '/api/taxonomies/{id}/provenance',
    description: 'Get provenance chain for a specific taxonomy',
    parameters: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Taxonomy UUID',
        example: 'uuid-123-456-789'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Provenance chain retrieved',
        example: {
          entries: [
            {
              uuid: 'uuid-123-456',
              actor: 'Dr. Sarah Chen',
              actorType: 'USER',
              role: 'admin',
              action: 'create',
              timestamp: '2023-10-03T07:00:00Z',
              md5Hash: 'a1b2c3d4e5f6'
            }
          ]
        }
      }
    ],
    examples: [
      {
        name: 'Get provenance',
        description: 'Retrieve full provenance chain for a taxonomy',
        request: {
          method: 'GET',
          url: '/api/taxonomies/uuid-123-456-789/provenance',
          headers: {
            'Authorization': 'Bearer your-api-key'
          }
        },
        response: {
          status: 200,
          body: {
            entries: []
          }
        }
      }
    ]
  }
]

export default function DocumentationPage() {
  const handleTryAPI = (endpoint: APIEndpoint, example: any) => {
    console.log('Testing API:', endpoint.path, example)
    // This would typically open an API testing interface
  }

  return (
    <div className="p-6" data-testid="documentation-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground">
          Complete reference for the Taxonomic Framework API including REST endpoints, GraphQL queries, and semantic exports
        </p>
      </div>

      <DocumentationPanel
        endpoints={mockEndpoints}
        onTryAPI={handleTryAPI}
      />
    </div>
  )
}