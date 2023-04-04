class Marker < ApplicationRecord

  after_create_commit { broadcast_insertion }
  after_update_commit { broadcast_update }
  after_destroy_commit { broadcast_deletion }

  private

  def broadcast_insertion
    ActionCable.server.broadcast "marker_channel", type: "add", data: self
  end

  def broadcast_update
    ActionCable.server.broadcast "marker_channel", type: "update", data: self
  end

  def broadcast_deletion
    ActionCable.server.broadcast "marker_channel", type: "delete", data: self
  end

end