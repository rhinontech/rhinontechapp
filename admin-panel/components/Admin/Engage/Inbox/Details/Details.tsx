"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, LinkIcon, MessageSquare, Plus, User, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Details = () => {
    const [sections, setSections] = useState({
      links: false,
      conversationAttributes: true,
      userData: true,
      recentConversations: false,
      userNotes: false,
      userTags: false,
    })
  
    const toggleSection = (section: keyof typeof sections) => {
      setSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }))
    }
  return (
    <div className="p-2 space-y-4">
      {/* Assignee and Team Inbox */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">Assignee</p>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="Ishra Fatima"
              />
              <AvatarFallback>IF</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Ishra Fatima</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">Team Inbox</p>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex items-center justify-center">
              <UserCircle className="h-5 w-5 text-gray-500" />
            </div>
            <span className="text-sm font-medium">Unassigned</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Links */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer py-2"
          onClick={() => toggleSection("links")}
        >
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Links</span>
          </div>
          {sections.links ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {sections.links && (
          <div className="pt-2 pl-7">
            {/* Links content would go here */}
            <p className="text-sm text-gray-500">No links available</p>
          </div>
        )}
      </div>

      <Separator />

      {/* Conversation attributes */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer py-2"
          onClick={() => toggleSection("conversationAttributes")}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            <span className="font-medium text-orange-500">
              Conversation attributes
            </span>
          </div>
          {sections.conversationAttributes ? (
            <ChevronDown className="h-5 w-5 text-orange-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-orange-500" />
          )}
        </div>
        {sections.conversationAttributes && (
          <div className="pt-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">ID</p>
              <p className="text-sm">3</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Brand</p>
              <p className="text-sm">Rhinon</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Subject</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-sm text-gray-500 flex items-center gap-1 justify-start"
              >
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Language</p>
              <p className="text-sm">English</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">External ID</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-sm text-gray-500 flex items-center gap-1 justify-start"
              >
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Workspace phone number</p>
              <p className="text-sm">—</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Copilot used</p>
              <p className="text-sm">False</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Topics</p>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* User data */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer py-2"
          onClick={() => toggleSection("userData")}
        >
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="font-medium">User data</span>
          </div>
          {sections.userData ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {sections.userData && (
          <div className="pt-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Name</p>
              <p className="text-sm">[Demo]</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-sm">email@projectmap.com</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Company</p>
              <p className="text-sm">—</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Type</p>
              <p className="text-sm">User</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Location</p>
              <p className="text-sm">—</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">Owner</p>
              <p className="text-sm">—</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-500 text-sm">User id</p>
              <p className="text-sm">6584b050-390c-4ca8-8650-9a90791aa</p>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Recent conversations */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer py-2"
          onClick={() => toggleSection("recentConversations")}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Recent conversations</span>
          </div>
          {sections.recentConversations ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {sections.recentConversations && (
          <div className="pt-2 pl-7">
            {/* Recent conversations content would go here */}
            <p className="text-sm text-gray-500">No recent conversations</p>
          </div>
        )}
      </div>

      <Separator />

      {/* User notes */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer py-2"
          onClick={() => toggleSection("userNotes")}
        >
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="font-medium">User notes</span>
          </div>
          {sections.userNotes ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {sections.userNotes && (
          <div className="pt-2 pl-7">
            {/* User notes content would go here */}
            <p className="text-sm text-gray-500">No user notes</p>
          </div>
        )}
      </div>

      <Separator />

      {/* User tags */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer py-2"
          onClick={() => toggleSection("userTags")}
        >
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="font-medium">User tags</span>
          </div>
          {sections.userTags ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {sections.userTags && (
          <div className="pt-2 pl-7">
            {/* User tags content would go here */}
            <p className="text-sm text-gray-500">No user tags</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
