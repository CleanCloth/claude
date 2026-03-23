import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer style={{
      backgroundColor: '#223A52',
      borderTop: '3px solid #3CACAE',
      paddingTop: '60px',
      paddingBottom: '30px',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Company Info */}
          <div>
            <img
              src="https://cleancloth.dk/wp-content/uploads/2025/08/cropped-cropped-image-scaled-1-1.png"
              alt="CleanCloth"
              style={{
                height: '48px',
                marginBottom: '20px',
                display: 'block'
              }}
            />
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              Professionel rengøring i Aarhus og omegn. Vi leverer høj kvalitet til private og erhverv.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a 
                href="https://facebook.com/cleancloth.dk" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  color: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3CACAE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com/cleancloth.dk" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  color: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3CACAE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://linkedin.com/company/cleancloth" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  color: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3CACAE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: 'white'
            }}>
              Vores Services
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => onNavigate?.('private-cleaning')}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Privat Rengøring
                </button>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => onNavigate?.('flytterengoring')}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Flytterengøring
                </button>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => onNavigate?.('erhverv')}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Erhvervsrengøring
                </button>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => onNavigate?.('extra-services')}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Ekstra Tilvalg
                </button>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: 'white'
            }}>
              Information
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => onNavigate?.('how-it-works')}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Sådan virker det
                </button>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => onNavigate?.('pricing')}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Priser
                </button>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => onNavigate?.('service-included')}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Hvad følger med?
                </button>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => onNavigate?.('faq')}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Spørgsmål & Svar
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: 'white'
            }}>
              Kontakt Os
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <MapPin size={20} style={{ color: '#3CACAE', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Aarhus, Danmark
                </span>
              </li>
              <li style={{ 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Phone size={20} style={{ color: '#3CACAE', flexShrink: 0 }} />
                <a 
                  href="tel:+4526712737" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  +45 26 71 27 37
                </a>
              </li>
              <li style={{ 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Mail size={20} style={{ color: '#3CACAE', flexShrink: 0 }} />
                <a 
                  href="mailto:info@cleancloth.dk" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  info@cleancloth.dk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          marginTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            margin: 0,
            fontSize: '14px'
          }}>
            © 2025 CleanCloth. Alle rettigheder forbeholdes.
          </p>
          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <a 
              href="/privatlivspolitik" 
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              Privatlivspolitik
            </a>
            <a 
              href="/handelsbetingelser" 
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              Handelsbetingelser
            </a>
            <a 
              href="/cookies" 
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3CACAE'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              Cookie Politik
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
