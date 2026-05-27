import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";

const genAI = new GoogleGenerativeAI(env.geminiApiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const RHINON_KNOWLEDGE = `
Rhinon Tech is a high-end data automation and business intelligence platform.
Core Services:
1. Custom Business Intelligence Dashboards: Centralizing KPIs from sales, marketing, and operations into one view.
2. Data Automation: Eliminating manual reporting and data entry.
3. Operational Efficiency: Using internal data to find bottlenecks and improve decision-making.
4. Custom Tools: Tailored web applications that solve specific internal operational problems.
Target Market: SaaS companies, high-growth agencies, and data-driven enterprises.
Value Proposition: "Unlock the power of your data to drive smarter, reactive decisions."
`;

export async function generateAIEmailDraft(leadData: any, templateData: any = null, customPrompt: string = "", senderName: string = "Rhinon Professional") {
  let prompt = `
    You are an expert sales copywriter for Rhinon Tech. 

    RHINON COMPANY KNOWLEDGE:
    ${RHINON_KNOWLEDGE}

    LEAD CONTEXT:
    Name: ${leadData.name}
    Company: ${leadData.company}
    Title: ${leadData.title || "Target Prospect"}
    
    TASK:
    1. Generate a professional sales outreach email targeting this lead.
  `;

  if (templateData) {
    prompt += `
    RESEARCH GUIDANCE:
    Template Subject: ${templateData.subject || "No subject provided"}
    Template Body to Complete: ${templateData.body}
    Specific AI Instructions: ${templateData.aiInstructions || "None"}

    SUB-TASK:
    - Complete the email draft based on the "Template Body to Complete".
    - Fill in any placeholders or instructions inside brackets like [AI to fill X].
    - Tailor the Benefits specifically to the lead's company (${leadData.company}) and their role (${leadData.title || "role"}).
    `;
  }

  if (customPrompt) {
    prompt += `
    CUSTOM USER INSTRUCTIONS:
    ${customPrompt}

    SUB-TASK:
    - Incorporate the custom instructions provided above.
    `;
  }

  prompt += `
    GENERAL REQUIREMENTS:
    - Maintain a professional, premium, and consultative tone.
    - Replace ALL variables:
       - {{lead.name}} -> ${leadData.name}
       - {{lead.company}} -> ${leadData.company}
       - {{lead.title}} -> ${leadData.title || "colleague"}
       - {{sender.name}} -> ${senderName}
    
    OUTPUT:
    Return a JSON object with:
    - "subject": A compelling subject line.
    - "body": The final personalized message body.
    
    DO NOT include any other headers or surrounding text. Only return the JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Failed to parse AI JSON response:", text);
  }

  return { body: text, subject: `Scaling ${leadData.company}'s operations` };
}

export async function generateTemplateWithAI(prompt: string, channel = "Email") {
  const isSocial = ["LinkedIn Post", "LinkedIn Video", "LinkedIn Article", "LinkedIn DM", "LinkedIn Connection"].includes(channel);

  const fullPrompt = isSocial
    ? `
    You are an expert social media content strategist for Rhinon Tech.

    RHINON COMPANY KNOWLEDGE:
    ${RHINON_KNOWLEDGE}

    CHANNEL: ${channel}
    USER REQUEST: ${prompt}

    TASK:
    Create a reusable ${channel} content template. The "body" is the seed content / writing guide for the AI.
    The AI will expand/rewrite the body into a final polished post when a campaign is executed.

    Return ONLY a JSON object with:
    - "name": Short descriptive template name (e.g. "Data Automation Thought Leadership")
    - "body": Seed content, key talking points, or a draft post (no placeholders needed for social)
    - "aiInstructions": 2-3 sentences telling the AI the tone, style, hashtags to include, and any channel-specific tips for ${channel}

    Do not include any surrounding text. Only return valid JSON.
  `
    : `
    You are an expert sales copywriter for Rhinon Tech, a high-end data automation and business intelligence platform.

    RHINON COMPANY KNOWLEDGE:
    ${RHINON_KNOWLEDGE}

    USER REQUEST: ${prompt}

    TASK:
    Create a reusable cold outreach email template.
    Use placeholders like {{lead.name}}, {{lead.company}}, {{lead.title}} wherever personalization makes sense.

    Return ONLY a JSON object with:
    - "name": Short descriptive template name (e.g. "SaaS Founder Intro")
    - "subject": A compelling subject line (may include {{lead.company}})
    - "body": The full email body with placeholders
    - "aiInstructions": 2-3 sentences guiding the AI on how to personalize this when sending

    Do not include any surrounding text. Only return valid JSON.
  `;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text().trim();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Failed to parse AI template JSON:", text);
  }

  return { error: "Failed to generate template" };
}

export async function generateImagePromptForCampaign(campaignName: string, channel: string, draft: string): Promise<string> {
  const prompt = `
    You are a visual art director for Rhinon Tech, a premium data automation company.

    Campaign: "${campaignName}" (${channel})
    Post content summary: ${draft.slice(0, 300)}

    Generate a concise, vivid image generation prompt (under 80 words) for a professional LinkedIn post image.
    Style: clean, modern, tech-forward, dark background with cyan/blue accents, no text in image.
    Return ONLY the image prompt text, nothing else.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function generateAISocialDraft(templateData: any = null): Promise<string> {
  const prompt = `
    You are an expert LinkedIn content creator for Rhinon Tech.

    RHINON COMPANY KNOWLEDGE:
    ${RHINON_KNOWLEDGE}

    ${templateData ? `TEMPLATE GUIDANCE:\n${templateData.body}\nAI Instructions: ${templateData.aiInstructions || "None"}` : ""}

    TASK:
    Write a compelling LinkedIn post for Rhinon Tech.
    - Professional yet engaging tone
    - 150-300 words
    - Include relevant hashtags at the end
    - No markdown formatting (plain text only)

    Return only the post text, no JSON, no labels.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function enrichLeadWithAI(leadName: string, companyName: string) {
  const prompt = `
    Research the following company and person for a sales outreach.
    Lead Name: ${leadName}
    Company: ${companyName}

    Return a JSON object with the following fields:
    - companyDescription: A short summary of what they do.
    - recentNews: Any recent product launch, funding, or major event.
    - potentialPainPoint: One operational inefficiency they might have that custom dashboards or automation could fix.
    - linkedinDiscoveryHint: A suggestion on how to find their specific profile (e.g. keywords).

    Only return the JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response" };
  } catch (e) {
    return { error: "Invalid AI response format" };
  }
}
